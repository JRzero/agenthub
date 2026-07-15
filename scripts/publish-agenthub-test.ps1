[CmdletBinding()]
param(
    [ValidatePattern("^[A-Za-z0-9.-]+$")]
    [string]$HostName = "47.76.253.198",

    [ValidatePattern("^[A-Za-z0-9._-]+$")]
    [string]$User = "root",

    [ValidatePattern("^[A-Za-z0-9.-]+$")]
    [string]$Domain = "agenthub-test.oyiioyii.com",

    [ValidateSet("http", "https")]
    [string]$DomainScheme = "http",

    [ValidateSet("live", "demo")]
    [string]$DataMode = "live",

    [string]$ApiUpstream = "https://api.linkyun.co",

    [ValidateRange(0, 65535)]
    [int]$DirectPort = 3002,

    [string]$SshKeyPath = "",

    [switch]$SkipInstall,
    [switch]$SkipChecks,
    [switch]$SkipPublicVerification
)

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = (Resolve-Path (Join-Path $ScriptDir "..")).Path
$TempRoot = [System.IO.Path]::GetTempPath()
$RemoteRoot = "/root/workspace/agenthub-test"
$RemoteNginxCompose = "/root/workspace/dist/docker-compose.yml"
$RemoteNginxConfig = "/root/workspace/dist/nginx/nginx.conf"
$PublicBase = "${DomainScheme}://$Domain"

function Require-Command([string]$Name) {
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "$Name is required"
    }
}

function Run-Native([string]$File, [string[]]$Arguments, [string]$Cwd = "") {
    if ($Cwd) {
        Push-Location $Cwd
    }

    try {
        & $File @Arguments
        if ($LASTEXITCODE -ne 0) {
            throw "$File failed with exit code $LASTEXITCODE"
        }
    }
    finally {
        if ($Cwd) {
            Pop-Location
        }
    }
}

function Run-NativeWithInput([string]$InputText, [string]$File, [string[]]$Arguments) {
    $InputText | & $File @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "$File failed with exit code $LASTEXITCODE"
    }
}

function Get-AgentHubCompose([int]$Port) {
    $portBlock = if ($Port -gt 0) {
@"
    ports:
      - "${Port}:3002"
"@
    }
    else {
        ""
    }

@"
name: agenthub-test

services:
  agenthub-test:
    image: node:22-alpine
    container_name: linkyun-agenthub-test
    working_dir: /app
$portBlock`n    volumes:
      - ./current:/app:ro
    tmpfs:
      - /app/.next/cache
    environment:
      NODE_ENV: production
      AGENTHUB_ENV: test
      PORT: "3002"
      HOSTNAME: 0.0.0.0
    command: node server.js
    restart: unless-stopped
    networks:
      dist-network:
        aliases:
          - agenthub-test

networks:
  dist-network:
    external: true
    name: dist_default
"@
}

function Get-AgentHubNginxBlock([string]$DomainName, [uri]$Upstream) {
    if ($Upstream.Scheme -ne "https") {
        throw "ApiUpstream must use https: $Upstream"
    }

    $upstreamValue = $Upstream.OriginalString.TrimEnd("/")

@"
    server {
        listen 80;
        server_name $DomainName;

        location /api/ {
            proxy_pass $upstreamValue;
            proxy_http_version 1.1;
            proxy_set_header Host $($Upstream.Host);
            proxy_set_header X-Real-IP `$remote_addr;
            proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto `$scheme;
            proxy_ssl_server_name on;
            proxy_ssl_protocols TLSv1.2 TLSv1.3;
            proxy_connect_timeout 10s;
            proxy_send_timeout 120s;
            proxy_read_timeout 120s;
        }

        location / {
            proxy_pass http://agenthub-test:3002;
            proxy_http_version 1.1;
            proxy_set_header Upgrade `$http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host `$host;
            proxy_set_header X-Real-IP `$remote_addr;
            proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto `$scheme;
            proxy_cache_bypass `$http_upgrade;
        }
    }
"@
}

function Update-NginxConfig([string]$Content, [string]$DomainName, [string]$Block) {
    $escapedHost = [regex]::Escape($DomainName)
    $serverName = [regex]::Match($Content, "(?m)^\s*server_name\s+$escapedHost\s*;")

    if (-not $serverName.Success) {
        $httpClosingBrace = $Content.LastIndexOf("}")
        if ($httpClosingBrace -lt 0) {
            throw "Could not find the closing http block in Nginx config"
        }

        return $Content.Substring(0, $httpClosingBrace).TrimEnd() + "`n`n" + $Block.TrimEnd() + "`n}`n"
    }

    $serverStart = $Content.LastIndexOf("server {", $serverName.Index, [System.StringComparison]::Ordinal)
    if ($serverStart -lt 0) {
        throw "Could not find the server block for $DomainName"
    }

    $depth = 0
    $serverEnd = -1
    for ($index = $serverStart; $index -lt $Content.Length; $index++) {
        if ($Content[$index] -eq "{") {
            $depth++
        }
        elseif ($Content[$index] -eq "}") {
            $depth--
            if ($depth -eq 0) {
                $serverEnd = $index
                break
            }
        }
    }

    if ($serverEnd -lt 0) {
        throw "Could not find the end of the server block for $DomainName"
    }

    return $Content.Substring(0, $serverStart) + $Block.TrimEnd() + $Content.Substring($serverEnd + 1)
}

$Ssh = Join-Path $env:WINDIR "System32\OpenSSH\ssh.exe"
$Scp = Join-Path $env:WINDIR "System32\OpenSSH\scp.exe"
if (-not (Test-Path -LiteralPath $Ssh)) { $Ssh = "ssh" }
if (-not (Test-Path -LiteralPath $Scp)) { $Scp = "scp" }

Require-Command $Ssh
Require-Command $Scp
Require-Command "git"
Require-Command "npm.cmd"
Require-Command "tar"
if (-not $SkipChecks) {
    Require-Command "openspec"
}

$SshOptions = @("-o", "BatchMode=yes", "-o", "ConnectTimeout=12", "-o", "StrictHostKeyChecking=accept-new")
if ($SshKeyPath) {
    if (-not (Test-Path -LiteralPath $SshKeyPath)) {
        throw "SSH key not found: $SshKeyPath"
    }
    $SshOptions = @("-i", $SshKeyPath) + $SshOptions
}

$Remote = "$User@$HostName"
$ShortCommit = (& git -C $ProjectRoot rev-parse --short HEAD).Trim()
if ($LASTEXITCODE -ne 0) {
    throw "Could not resolve the current Git commit"
}

$Release = "$(Get-Date -Format 'yyyyMMdd-HHmmss')-$ShortCommit"
$StageRoot = Join-Path $TempRoot "agenthub-test-$Release"
$RuntimeRoot = Join-Path $StageRoot "standalone"
$Archive = Join-Path $StageRoot "agenthub-$Release.tar.gz"
$ComposeFile = Join-Path $StageRoot "docker-compose.yml"
$NginxFile = Join-Path $StageRoot "nginx.conf"
$RemoteArchive = "/tmp/agenthub-$Release.tar.gz"
$RemoteCompose = "/tmp/agenthub-$Release-compose.yml"
$RemoteNginx = "/tmp/agenthub-$Release-nginx.conf"
$TsBuildInfo = Join-Path $ProjectRoot "tsconfig.tsbuildinfo"
$HadTsBuildInfo = Test-Path -LiteralPath $TsBuildInfo

try {
    if (-not $SkipInstall) {
        Write-Host "Installing locked dependencies"
        Run-Native "npm.cmd" @("ci") $ProjectRoot
    }

    if (-not $SkipChecks) {
        Write-Host "Running verification gates"
        Run-Native "npm.cmd" @("run", "lint") $ProjectRoot
        Run-Native "npm.cmd" @("run", "typecheck") $ProjectRoot
        Run-Native "npm.cmd" @("test") $ProjectRoot
        Run-Native "openspec" @("validate", "--all", "--strict") $ProjectRoot
    }

    $previousApiUrl = $env:NEXT_PUBLIC_API_URL
    $previousDataMode = $env:NEXT_PUBLIC_AGENTHUB_DATA_MODE
    $previousNodeEnv = $env:NODE_ENV
    try {
        $env:NEXT_PUBLIC_API_URL = $PublicBase
        $env:NEXT_PUBLIC_AGENTHUB_DATA_MODE = $DataMode
        $env:NODE_ENV = "production"
        Write-Host "Building AgentHub for $PublicBase ($DataMode)"
        Run-Native "npm.cmd" @("run", "build") $ProjectRoot
    }
    finally {
        $env:NEXT_PUBLIC_API_URL = $previousApiUrl
        $env:NEXT_PUBLIC_AGENTHUB_DATA_MODE = $previousDataMode
        $env:NODE_ENV = $previousNodeEnv
    }

    Write-Host "Packaging standalone release: $Release"
    New-Item -ItemType Directory -Path $StageRoot -Force | Out-Null
    Copy-Item -LiteralPath (Join-Path $ProjectRoot ".next\standalone") -Destination $StageRoot -Recurse -Force
    New-Item -ItemType Directory -Path (Join-Path $RuntimeRoot ".next") -Force | Out-Null
    Copy-Item -LiteralPath (Join-Path $ProjectRoot ".next\static") -Destination (Join-Path $RuntimeRoot ".next") -Recurse -Force
    New-Item -ItemType Directory -Path (Join-Path $RuntimeRoot ".next\cache") -Force | Out-Null
    Copy-Item -LiteralPath (Join-Path $ProjectRoot "public") -Destination $RuntimeRoot -Recurse -Force
    Run-Native "tar" @("-czf", $Archive, "-C", $RuntimeRoot, ".") $ProjectRoot

    $upstreamUri = [uri]$ApiUpstream
    $compose = Get-AgentHubCompose $DirectPort
    $nginxBlock = Get-AgentHubNginxBlock $Domain $upstreamUri
    [System.IO.File]::WriteAllText($ComposeFile, $compose, (New-Object System.Text.UTF8Encoding($false)))

    Write-Host "Downloading current Nginx config"
    Run-Native $Scp ($SshOptions + @("${Remote}:$RemoteNginxConfig", $NginxFile)) $ProjectRoot
    $currentNginx = [System.IO.File]::ReadAllText($NginxFile)
    $updatedNginx = Update-NginxConfig $currentNginx $Domain $nginxBlock
    [System.IO.File]::WriteAllText($NginxFile, $updatedNginx, (New-Object System.Text.UTF8Encoding($false)))

    Write-Host "Uploading release and deployment config"
    Run-Native $Scp ($SshOptions + @($Archive, "${Remote}:$RemoteArchive")) $ProjectRoot
    Run-Native $Scp ($SshOptions + @($ComposeFile, "${Remote}:$RemoteCompose")) $ProjectRoot
    Run-Native $Scp ($SshOptions + @($NginxFile, "${Remote}:$RemoteNginx")) $ProjectRoot

    $remoteScript = @'
set -eu
remote_root="$1"
release="$2"
archive="$3"
compose_source="$4"
nginx_source="$5"
nginx_config="$6"
nginx_compose="$7"
domain="$8"

stamp=$(date +%Y%m%d%H%M%S)
release_dir="$remote_root/releases/$release"

mkdir -p "$release_dir"
tar -xzf "$archive" -C "$release_dir"
test -f "$release_dir/server.js"
mkdir -p "$release_dir/.next/cache"

if [ -f "$remote_root/docker-compose.yml" ]; then
  cp -a "$remote_root/docker-compose.yml" "$remote_root/docker-compose.yml.bak.$stamp"
fi
cp "$compose_source" "$remote_root/docker-compose.yml"
docker compose -f "$remote_root/docker-compose.yml" config --quiet

ln -sfn "releases/$release" "$remote_root/current"
docker compose -f "$remote_root/docker-compose.yml" up -d --no-deps --force-recreate agenthub-test

for attempt in $(seq 1 20); do
  if docker exec linkyun-agenthub-test wget -q -O /dev/null http://127.0.0.1:3002/login; then
    break
  fi
  if [ "$attempt" = 20 ]; then
    docker logs --tail 120 linkyun-agenthub-test
    exit 1
  fi
  sleep 1
done

docker run --rm --network dist_default -v "$nginx_source:/etc/nginx/nginx.conf:ro" nginx:alpine nginx -t
cp -a "$nginx_config" "$nginx_config.bak.$stamp"
cp "$nginx_source" "$nginx_config"
docker compose -f "$nginx_compose" up -d --no-deps --force-recreate nginx
docker exec linkyun-ui-nginx nginx -t

page_status=$(curl -sS -o /dev/null -w '%{http_code}' -H "Host: $domain" http://127.0.0.1/login)
api_status=$(curl -sS -o /dev/null -w '%{http_code}' -H "Host: $domain" http://127.0.0.1/api/v1/agents)
if [ "$page_status" != 200 ]; then
  echo "AgentHub login returned $page_status" >&2
  exit 1
fi
if [ "$api_status" != 401 ]; then
  echo "AgentHub API smoke check expected 401, got $api_status" >&2
  exit 1
fi

rm -f "$archive" "$compose_source" "$nginx_source"
printf 'release=%s\nlogin=%s\napi=%s\n' "$release" "$page_status" "$api_status"
'@

    Write-Host "Deploying $Release to $Remote"
    $remoteArguments = $SshOptions + @(
        $Remote,
        "bash",
        "-s",
        "--",
        $RemoteRoot,
        $Release,
        $RemoteArchive,
        $RemoteCompose,
        $RemoteNginx,
        $RemoteNginxConfig,
        $RemoteNginxCompose,
        $Domain
    )
    Run-NativeWithInput $remoteScript $Ssh $remoteArguments

    if (-not $SkipPublicVerification) {
        Write-Host "Verifying public login page: $PublicBase/login"
        $response = Invoke-WebRequest -UseBasicParsing -Uri "$PublicBase/login" -TimeoutSec 20
        if ($response.StatusCode -ne 200) {
            throw "Public login page returned $($response.StatusCode)"
        }
    }

    Write-Host "AgentHub test deployment completed: $Release"
}
finally {
    if (Test-Path -LiteralPath $StageRoot) {
        Remove-Item -LiteralPath $StageRoot -Recurse -Force
    }
    if (-not $HadTsBuildInfo -and (Test-Path -LiteralPath $TsBuildInfo)) {
        Remove-Item -LiteralPath $TsBuildInfo -Force
    }
}

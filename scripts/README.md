# Deployment scripts

## Publish AgentHub to the test server

`publish-agenthub-test.ps1` builds the current checkout, packages Next.js standalone output, deploys it to the independent AgentHub test Compose project, updates the shared Nginx route, and verifies the login page plus the unauthenticated API contract.

Run from the repository root:

```powershell
.\scripts\publish-agenthub-test.ps1
```

The default target is `root@47.76.253.198` with `agenthub-test.oyiioyii.com` as the HTTP test domain. It preserves the direct host port `3002`, although public access to that port still requires an ECS security-group rule.

Useful options:

```powershell
# Use a specified SSH key.
.\scripts\publish-agenthub-test.ps1 -SshKeyPath C:\Users\65420\.ssh\linkyun-test-ed25519

# Deploy against a separate backend without changing frontend code.
.\scripts\publish-agenthub-test.ps1 -ApiUpstream https://api-test.example.com

# Build for an HTTPS domain after the server has a TLS listener.
.\scripts\publish-agenthub-test.ps1 -DomainScheme https

# Skip local install/check gates only for an already-verified iteration.
.\scripts\publish-agenthub-test.ps1 -SkipInstall -SkipChecks
```

The test frontend uses `NODE_ENV=production` so it runs the optimized Next.js server. The deployment tier is represented by `AGENTHUB_ENV=test` in the container. By default, `/api/` proxies to `https://api.linkyun.co`; supply `-ApiUpstream` before publishing if a separate test backend is available.

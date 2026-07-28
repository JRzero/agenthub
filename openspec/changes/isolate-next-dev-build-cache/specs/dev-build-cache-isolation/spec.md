## ADDED Requirements

### Requirement: Development output is isolated
The frontend configuration SHALL write Next.js development artifacts to a directory that is separate from the production `.next` directory.

#### Scenario: Development server starts
- **WHEN** AgentHub starts with `NODE_ENV=development`
- **THEN** Next.js uses `.next-dev` as its output directory

#### Scenario: Production build runs during development
- **WHEN** a production build writes `.next` while a development server is running
- **THEN** the development server artifacts in `.next-dev` remain available

### Requirement: Production output contract is preserved
The frontend configuration SHALL keep production build and production start artifacts in `.next` so the existing standalone and Docker release paths remain compatible.

#### Scenario: Production build starts
- **WHEN** AgentHub builds with `NODE_ENV=production`
- **THEN** Next.js uses `.next` as its output directory

#### Scenario: Non-development environment resolves output
- **WHEN** the output directory is resolved for a test, production, or unspecified environment
- **THEN** the resolver returns `.next`

### Requirement: Development cache is not versioned
The repository MUST ignore the generated `.next-dev` directory.

#### Scenario: Development cache is generated
- **WHEN** the development server creates `.next-dev`
- **THEN** Git does not report the directory as an untracked source change

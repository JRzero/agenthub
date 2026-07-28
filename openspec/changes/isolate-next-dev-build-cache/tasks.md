## 1. Output Directory Configuration

- [x] 1.1 Add a pure resolver for development and production Next.js output directories
- [x] 1.2 Configure `next.config.ts` to use the resolved directory
- [x] 1.3 Ignore the generated `.next-dev/` directory

## 2. Automated Verification

- [x] 2.1 Add unit coverage for development, production, test, and unspecified environments
- [x] 2.2 Run lint, typecheck, unit tests, production build, and strict OpenSpec validation

## 3. Concurrent Runtime Verification

- [x] 3.1 Restart the development service and confirm it writes `.next-dev`
- [x] 3.2 Run a production build while development remains active and confirm both output directories coexist
- [x] 3.3 Verify the development page still responds and recompiles after the production build

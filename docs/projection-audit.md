# Projection audit

This is the release projection's ruthless inventory. A file stays only when it is part of the runnable template, a direct verification boundary, or the minimum documentation needed to adapt the template. Generated output, local databases, coverage, screenshots, dependency folders, internal governance records, and release evidence are excluded by the projection generator.

## Decision summary

- Removed `THIRD_PARTY_NOTICES.md` from the source and projection. Dependency-license validation remains an internal repository gate.
- Kept one root application workspace and one portal workspace. The portal is the promised web example, not a second implementation of the workflow.
- Kept four projected smoke tests plus the portal browser test. The broader development suite remains outside the customer-facing projection.
- Kept only documentation linked from the README, the generated-repository contribution notice, the portal run note, and this audit.
- Kept operational scripts only when referenced by a projected package command or imported by one of those scripts.
- Kept all projected `src` files because they are runtime code, typed integration contracts, explicit customer adapter examples, or eval datasets imported by a retained command. Step modules are intentionally granular so schemas and execution logic can be reviewed together.

## Workspaces and build configuration

| File or workspace                 | Keep | Justification                                                                                                                  |
| --------------------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------ |
| `package.json`                    | Yes  | Defines the runnable Mastra application, public commands, exact non-Mastra dependencies, and the portal workspace.             |
| `portal/package.json`             | Yes  | Isolates React/Vite dependencies from the workflow runtime while keeping the example portal installable with one root command. |
| `tsconfig.json`                   | Yes  | Enforces strict type checking across runtime code, scripts, and projected smoke tests.                                         |
| `tsconfig.build.json`             | Yes  | Produces declarations and source maps for the server/runtime source without test and script output.                            |
| `portal/tsconfig.json`            | Yes  | Applies browser and JSX compiler settings that are incompatible with the Node runtime config.                                  |
| `vitest.config.ts`                | Yes  | Defines the root smoke-test discovery and timeout contract.                                                                    |
| `portal/vite.config.ts`           | Yes  | Builds and serves the example portal.                                                                                          |
| `portal/vitest.browser.config.ts` | Yes  | Runs the portal's real-browser test with its required browser provider.                                                        |
| `.env.example`                    | Yes  | Keeps first run to one required key and points optional configuration to documentation.                                        |
| `.gitignore`                      | Yes  | Prevents credentials, local databases, generated builds, evidence, and dependencies from entering a customer repository.       |

## Scripts

| Script                                   | Keep | Justification                                                                                                          |
| ---------------------------------------- | ---- | ---------------------------------------------------------------------------------------------------------------------- |
| `scripts/build-mastra.ts`                | Yes  | Creates the deployable Mastra build used by `npm run build:mastra` with deterministic build-only environment settings. |
| `scripts/start-studio.ts`                | Yes  | Launches Mastra Studio for `npm run dev` without making Studio the only execution surface.                             |
| `scripts/migrate.ts`                     | Yes  | Applies operational and analytics schemas for explicit deployments and recovery.                                       |
| `scripts/reset-demo.ts`                  | Yes  | Resets only the contained demonstration data root for repeatable local trials.                                         |
| `scripts/verify-clean-default.ts`        | Yes  | Proves a credential-free provider path still boots and runs in CI or local verification.                               |
| `scripts/evaluate-extraction.ts`         | Yes  | Measures structured document extraction accuracy against the retained dataset.                                         |
| `scripts/evaluate-kyc-quality.ts`        | Yes  | Runs the baseline KYC scorers exposed by `npm run eval:baseline`.                                                      |
| `scripts/evaluate-kyc-experiments.ts`    | Yes  | Compares model/prompt candidates without changing deterministic compliance authority.                                  |
| `scripts/refresh-analytics.ts`           | Yes  | Projects redacted operational events into the local analytics model on demand.                                         |
| `scripts/prune-observability.ts`         | Yes  | Enforces bounded local trace and experiment retention.                                                                 |
| `scripts/live-multimodal-smoke.ts`       | Yes  | Provides an explicit, non-CI check for the optional OpenAI extraction adapter.                                         |
| `scripts/live-opensanctions-smoke.ts`    | Yes  | Provides an explicit, budget-gated check for the optional OpenSanctions adapter.                                       |
| `scripts/lib/campaign-request-ledger.ts` | Yes  | Atomically enforces the request and budget limits used by the retained OpenSanctions smoke script.                     |

## Tests

| Test                                | Keep | Justification                                                                                          |
| ----------------------------------- | ---- | ------------------------------------------------------------------------------------------------------ |
| `tests/workflow-smoke.test.ts`      | Yes  | Verifies the public start tool and durable workflow entry point.                                       |
| `tests/api-smoke.test.ts`           | Yes  | Verifies the public HTTP intake boundary, status, review, and idempotency behavior.                    |
| `tests/pii-smoke.test.ts`           | Yes  | Guards the highest-risk boundary: sensitive data must not leak into workflow state or public surfaces. |
| `tests/helpers/test-config.ts`      | Yes  | Centralizes deterministic test configuration shared by the three root smoke tests.                     |
| `portal/tests/app.browser.test.tsx` | Yes  | Proves the included portal works in a real browser against the expected API contract.                  |

## Documentation

| Document                      | Keep | Justification                                                                                                                         |
| ----------------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `README.md`                   | Yes  | Official template landing page, three-step quickstart, execution choices, Mastra features, adaptation guidance, and final disclaimer. |
| `CONTRIBUTING.md`             | Yes  | Explains that the standalone repository is generated and routes contributions to the Mastra monorepo.                                 |
| `docs/configuration.md`       | Yes  | Moves every optional environment setting out of the first-run `.env.example`.                                                         |
| `docs/opensanctions.md`       | Yes  | Records the optional screening adapter's candidate semantics, privacy gate, request budget, and safe live-smoke procedure.            |
| `docs/customize-providers.md` | Yes  | Shows where customer document, verification, screening, communication, and provisioning integrations belong.                          |
| `docs/customize-policy.md`    | Yes  | Explains jurisdiction, policy versioning, and deterministic decision boundaries.                                                      |
| `docs/add-scenario.md`        | Yes  | Documents how to extend safe fixture/demo coverage.                                                                                   |
| `docs/use-api.md`             | Yes  | Documents the API and portal execution path promised by the README.                                                                   |
| `portal/README.md`            | Yes  | Gives focused commands and boundaries to developers working only on the portal workspace.                                             |
| `docs/projection-audit.md`    | Yes  | Records why every projected script, test, document, and workspace remains.                                                            |

## Excluded material

The generator must not publish `node_modules`, `.mastra`, `dist`, coverage, local databases, local document storage, `.env`, internal evidence, phase records, screenshots, lockfile review ledgers, or the projection manifest. These are generated, machine-local, internal, or review-only artifacts and do not belong in a new customer repository.

# OrangeHRM UI E2E Automation - Playwright + TypeScript

This repository contains UI end-to-end automation tests for a local OrangeHRM application using Playwright, TypeScript, pnpm, Docker, ESLint, Prettier, Monocart Reporter, and GitHub Actions.

## Project Scope

The automation covers atomic CRUD test cases for the following OrangeHRM modules:

- Employee
  - Create Employee
  - Read Employee
  - Update Employee
  - Delete Employee
- Leave Type
  - Create Leave Type
  - Read Leave Type
  - Update Leave Type
  - Delete Leave Type
- Claim Event
  - Create Event
  - Read Event
  - Update Event
  - Delete Event
- Claim Self
  - Create Claim
  - Read Claim
  - Update Claim
  - Delete / Cancel Claim

Each test is designed to be independent and uses unique timestamp/random-based data to reduce collisions during repeated or parallel execution.

## Tech Stack

- Playwright
- TypeScript
- pnpm
- Docker / Docker Compose
- ESLint
- Prettier
- Monocart HTML Reporter
- GitHub Actions

## Prerequisites

Before running this project locally, install:

- Node.js 20 or above
- pnpm 10.24.0 or above
- Docker Desktop
- Git

Check installed versions:

```bash
node -v
pnpm -v
docker --version
docker compose version
```

## Environment Variables

Create a `.env` file in the project root by following `.env.example`.

Example:

```env
BASE_URL=http://localhost:8080
ADMIN_USERNAME=<your-admin-username>
ADMIN_PASSWORD=<your-admin-password>
SERVER_MODE=docker
WAIT_TIMEOUT_MS=300000
```

Important:

- Do not commit `.env`.
- Use `.env.example` for shared configuration.
- In GitHub Actions, credentials must be stored as GitHub Secrets.

Required GitHub Secrets:

```text
ADMIN_USERNAME
ADMIN_PASSWORD
```

## Install Dependencies

Install project dependencies:

```bash
pnpm install
```

Install Playwright browsers:

```bash
pnpm exec playwright install --with-deps
```

## Start OrangeHRM Locally

Start the local OrangeHRM Docker environment:

```bash
docker compose -f docker-compose.orangehrm.yml up -d --force-recreate
```

Check running containers:

```bash
docker compose -f docker-compose.orangehrm.yml ps
```

Open OrangeHRM in browser:

```text
http://localhost:8080/web/index.php/auth/login
```

Stop the local Docker environment:

```bash
docker compose -f docker-compose.orangehrm.yml down -v --remove-orphans
```

## Run Tests Locally

Run all tests:

```bash
pnpm test
```

Run all tests in headed mode:

```bash
pnpm exec playwright test --headed
```

Run Chromium only:

```bash
pnpm exec playwright test --project=chromium --reporter=list
```

Run Claim module only:

```bash
pnpm exec playwright test tests/ui/Claim --project=chromium --headed --workers=1 --reporter=list
```

Run Leave module only:

```bash
pnpm exec playwright test tests/ui/leave --project=chromium --headed --workers=1 --reporter=list
```

Run PIM module only:

```bash
pnpm exec playwright test tests/ui/pim --project=chromium --headed --workers=1 --reporter=list
```

## Code Quality Checks

Run Prettier format check:

```bash
pnpm run format:check
```

Auto-format files:

```bash
pnpm run format
```

Run ESLint:

```bash
pnpm run lint
```

Run TypeScript check:

```bash
pnpm exec tsc --noEmit
```

Recommended before pushing:

```bash
pnpm run format
pnpm run format:check
pnpm run lint
pnpm exec tsc --noEmit
pnpm test
```

## Reports and Artifacts

Open local Playwright HTML report:

```bash
pnpm exec playwright show-report playwright-report
```

Generated output folders:

```text
playwright-report/
test-results/
reports/
```

GitHub Actions uploads test artifacts including:

- Playwright HTML report
- Monocart report
- Test results
- Traces
- Videos on failure

## CI/CD

GitHub Actions workflow file:

```text
.github/workflows/playwright.yml
```

The CI pipeline performs the following steps:

1. Checks out the repository
2. Starts the local OrangeHRM Docker environment
3. Waits for OrangeHRM readiness
4. Installs dependencies
5. Installs Playwright browsers
6. Runs Prettier format check
7. Runs ESLint
8. Runs TypeScript check
9. Runs Playwright UI tests
10. Uploads test reports and artifacts
11. Stops Docker containers

## Project Structure

```text
.github/workflows/        GitHub Actions workflow
database/                 OrangeHRM database setup files
docker/orangehrm/         OrangeHRM Docker configuration
docs/                     Test case documentation
pages/                    Page Object Model classes
setups/                   Test setup and reusable helper functions
scripts/                  Global setup and teardown scripts
test-data/                Test data files
tests/                    Playwright test specs
utils/                    Shared utility functions
playwright.config.ts      Playwright configuration
package.json              Project scripts and dependencies
```

## Test Design Notes

- Tests are atomic and focus on one main objective.
- Page Object Model is used for maintainability.
- Setup helpers create required prerequisite data.
- Unique timestamp/random suffixes are used to avoid duplicate data collisions.
- Stable locators and explicit assertions are used where possible.
- Playwright traces and videos help debug test failures.
- Tests are configured to run across multiple browsers.

## Known Limitations and Assumptions

- Tests target a local OrangeHRM instance, not the public OrangeHRM demo.
- Docker Desktop must be running before local execution.
- CI requires valid `ADMIN_USERNAME` and `ADMIN_PASSWORD` GitHub Secrets.
- Some UI flows depend on default OrangeHRM data, such as claim expense types and currency options.
- The local OrangeHRM instance may take extra time to become fully ready after the login page responds.
- Some test data may remain in the local test database if the application does not support hard deletion from the UI.

## Test Cases Document

Detailed test cases are available in:

```text
docs/test-cases.md
```

## Submission Format

Submit the repository link and the latest successful GitHub Actions run link.

Suggested format:

```text
Repo-01: <repo-link> | CI Run: <latest-successful-actions-run-link>
```
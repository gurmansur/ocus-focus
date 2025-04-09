# E2E Tests for Ocus Focus API

This directory contains end-to-end tests for the Ocus Focus API. These tests use a separate database to avoid affecting the development or production data.

## Test Setup

The tests are configured to use a separate test database (`ocus_focus_test`) with the following features:

- Isolated test environment with its own database
- Database is automatically cleaned up between test runs
- JWT authentication for protected endpoints
- Test data is created for each test suite

## Configuration

The tests use the configuration from `.env.test` at the root of the project. Make sure this file contains the proper database settings:

```
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=ocus_focus_test
```

## Creating the Test Database

Before running the tests, you need to create the test database:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS ocus_focus_test;"
```

## Test Timeouts

The tests have been configured with extended timeouts to allow for database operations:

- Default test timeout is set to 30 seconds in `jest-e2e.json`
- `beforeAll` hooks have a 30-second timeout
- `afterAll` hooks have a 10-second timeout

If you encounter timeout errors, you may need to increase these values further.

## Database Connection Issues

If you encounter errors like `Unable to connect to the database`, make sure:

1. MySQL server is running
2. Database credentials in `.env.test` are correct
3. The test database exists and is accessible
4. The MySQL user has appropriate permissions

You can test the connection with:

```bash
mysql -u [username] -p -h [host] ocus_focus_test
```

## Running the Tests

To run all e2e tests:

```bash
npm run test:e2e
```

To run a specific test:

```bash
npm run test:e2e -- --testPathPattern=auth.e2e-spec.ts
```

## Test Structure

Each test file follows this general structure:

1. **Setup**: Initializing the application and creating test data
2. **Tests for each endpoint**: Testing various scenarios (success, failure, authorization)
3. **Cleanup**: Cleaning up the database after tests

## Available Test Suites

The e2e tests cover the following modules:

- Auth: Authentication endpoints (signup, signin, verify)
- Arquivo: File management endpoints
- Ator: Actor management endpoints
- Caso de Teste: Test case management endpoints
- Caso de Uso: Use case management endpoints
- Cenarios: Scenario management endpoints
- Colaborador: Collaborator management endpoints
- Colaborador-Projeto: Project collaborator management endpoints
- Email: Email sending functionality
- Estimativa: Estimation management endpoints
- Execucao-de-Teste: Test execution management endpoints
- Fator-Ambiental-Projeto: Environmental factor management endpoints
- Fator-Tecnico-Projeto: Technical factor management endpoints
- Fatores-Ambientais: Environmental factors management endpoints
- Fatores-Tecnicos: Technical factors management endpoints
- Kanban: Kanban board management endpoints
- Priorizacao: Prioritization management endpoints
- Projeto: Project management endpoints
- Requisito: Requirement management endpoints
- Resultado-Requisito: Requirement result management endpoints
- Sprint: Sprint management endpoints
- Stakeholder: Stakeholder management endpoints
- Status-Priorizacao: Prioritization status management endpoints
- Subtarefa: Subtask management endpoints
- Suite-de-Teste: Test suite management endpoints
- Tag: Tag management endpoints
- User-Story: User story management endpoints

## Adding New Tests

To add tests for a new module:

1. Create a new file named `[module-name].e2e-spec.ts`
2. Follow the same pattern as existing tests
3. Make sure to use the utility functions from `test-utils.ts` for app initialization and cleanup
4. Use proper timeouts for `beforeAll` and `afterAll` hooks

## Debugging Failed Tests

If a test is failing, you can debug it by:

1. Running only that specific test file
2. Adding console.log statements to see what's happening
3. Checking the database to see if the test data was created correctly
4. Using the `--verbose` flag to see more details: `npm run test:e2e -- --verbose`

## Notes

- The tests use a separate database with `dropSchema: true` to ensure a clean environment for each test run
- Authentication is handled by creating test users and obtaining JWT tokens
- All entities created during tests are automatically removed when the test completes
- Tests are isolated to prevent interference between different test suites

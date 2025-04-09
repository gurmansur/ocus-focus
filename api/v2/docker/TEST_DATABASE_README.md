# Ocus Focus Test Database Setup

This guide explains how to set up and use the `ocus_focus_test` database for testing purposes.

## Requirements

- Docker
- Docker Compose

## Setup Instructions

1. Make sure Docker is running on your system.

2. Build and start the test database container:

```bash
docker-compose -f docker-compose.test.yml up -d
```

3. The test database `ocus_focus_test` will be accessible at:

   - Host: localhost
   - Port: 3307
   - Username: root
   - Password: root
   - Database name: ocus_focus_test

4. When connecting programmatically using JDBC or other connectors, use these connection parameters to avoid "Public Key Retrieval" errors:

```
jdbc:mysql://localhost:3307/ocus_focus_test?allowPublicKeyRetrieval=true&useSSL=false
```

For other clients, make sure to include these parameters:

- `allowPublicKeyRetrieval=true` - This is needed to avoid the "Public Key Retrieval is not allowed" error
- `useSSL=false` - Disables SSL which may cause connection issues in test environments

5. To connect to the database using the command line:

```bash
mysql -h localhost -P 3307 -u root -p ocus_focus_test
```

6. To stop the container:

```bash
docker-compose -f docker-compose.test.yml down
```

7. To stop the container and remove all data:

```bash
docker-compose -f docker-compose.test.yml down -v
```

## Database Structure

The test database is built using a clear two-stage process:

1. **Schema Creation**: All tables, keys, indexes, and relationships are explicitly created using a dedicated schema creation script to ensure all tables exist before attempting to populate them with data.

2. **Data Population**: Sample data is inserted into the tables based on the proper dependency order, ensuring referential integrity.

## Test Data

The test database is automatically populated with sample data for testing purposes, including:

- Users, collaborators, and stakeholders
- Test projects with requirements and use cases
- Kanbans with swimlanes
- User stories and tasks
- Test suites and test cases
- Environmental and technical factors for effort estimation

This sample data allows you to immediately begin testing your application against a realistic dataset without having to manually create test data.

## Troubleshooting

If you encounter connection issues:

1. Make sure the container is running:

```bash
docker ps
```

2. Check the container logs:

```bash
docker logs ocus_focus_test_container
```

3. For connection issues from applications, ensure you're using the correct connection string parameters.

## Notes

- The test database runs on port 3307 to avoid conflicts with any existing MySQL instances on the default port 3306.
- The database is initialized with explicit schema creation and test data population scripts.
- The MySQL server uses root user authentication for simplified testing environments.

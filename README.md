# Blueprints API

A NestJS-based RESTful API for managing infrastructure blueprints, with PostgreSQL integration, JSON schema support, and full Swagger documentation.

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL (locally or in Docker)
- npm or yarn

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file with content:

```env
PORT=3000  
DB_HOST=localhost  
DB_PORT=5432  
DB_USERNAME=postgres  
DB_PASSWORD=postgres  
DB_NAME=blueprints
```

### Start PostgreSQL (Optional with Docker)

```bash
docker run --name pg-blueprints -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=blueprints -d postgres
```

### Run the App

```bash
npm run start:dev
```

App will be available at [http://localhost:3000](http://localhost:3000)


## Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

Requires `sqlite3` for in-memory testing.

```bash
npm install sqlite3 --save-dev  
npm run test:e2e
```


## API Documentation (Swagger)

After running the app, visit [http://localhost:3000/swagger](http://localhost:3000/swagger) to explore and test endpoints via Swagger UI.

You can use Swagger/OpenAPI spec to auto-generate TypeScript client:
```bash
npx openapi-typescript http://localhost:3000/swagger-json -o api.ts
```

## Blueprint Data Model

PostgreSQL Table Schema (will be created automatically):

```sql
CREATE TABLE blueprints (  
  id SERIAL PRIMARY KEY,  
  name VARCHAR(255),  
  version VARCHAR(50),  
  author VARCHAR(255),  
  data JSONB  
);
```

## API Endpoints

| Method | Endpoint        | Description         | 
|--------|-----------------|---------------------|
| POST   | /blueprints     | Create a blueprint  |
| GET    | /blueprints     | List blueprints*    |
| GET    | /blueprints/:id | Get blueprint by id |
| PUT    | /blueprints/:id | Update blueprint    |
| DELETE | /blueprints/:id | Delete blueprint    |

*Supports query parameters: `name`, `version`, `author`.


## Rate Limiting (Optional)

You can enable request rate limiting by setting the following environment variables:

```env
RATE_LIMIT_TTL=1000      # Time window in milliseconds
RATE_LIMIT_LIMIT=10      # Max number of requests allowed per window per IP
```

If these are not set, rate limiting will be disabled by default.

The rate limiter is powered by `@nestjs/throttler` and protects all endpoints globally.



## Health Checks

This project includes built-in health check endpoints using `@nestjs/terminus`. These are useful for monitoring, uptime checks, and container orchestration readiness/liveness probes.

| Endpoint      | Purpose                                       |
|---------------|-----------------------------------------------|
| /health	      | Verifies database connectivity                |
| /health/live  |	Basic liveness probe (always responds 200)    |
| /health/ready |	Readiness probe (checks DB, disk, and memory) |

### Probes covered in /health/ready:

- PostgreSQL database connection
- Disk usage threshold (platform-aware)
- Heap and RSS memory thresholds


## Tech Stack

- NestJS (TypeScript)
- PostgreSQL (TypeORM)
- Swagger/OpenAPI
- Jest (Unit + E2E tests)
- SQLite (in-memory for testing) 


## Postman Collection

A ready-to-use Postman collection (`postman.json`) is included to test all Blueprints endpoints.


## Go CLI Tool

This project includes a Go-based CLI client to interact with the NestJS backend.

#### Supported Commands

```bash
go run cli.go create --file bricks.json          # Create a new blueprint from file
go run cli.go get --id 123                       # Get a blueprint by ID
go run cli.go list                               # List all blueprints
go run cli.go update --id 123 --file update.json # Update a blueprint
go run cli.go delete --id 123                    # Delete a blueprint
```

#### Requirements

- Go 1.18+
- REST API running at http://localhost:3000/blueprints (or modify baseURL in `cli/cli.go`)

#### File Format

The `--file` argument expects a JSON file with following structure:

```json
{
  "name": "aws_neptune",
  "version": "1.1.0",
  "author": "bluebricks@example.com",
  "data": {
    "packages": ["aws"],
    "props": { "region": "us-east-1" },
    "outs": ["endpoint"]
  }
}
```

You can use update.json for updates with partial fields.
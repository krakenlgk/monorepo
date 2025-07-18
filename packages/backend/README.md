# Backend Application

This is a Nest.js backend application with PostgreSQL database integration using TypeORM.

## Database Setup

### Prerequisites

- PostgreSQL database running on localhost:5432 (or configure via environment variables)
- Database named `monorepo_dev` (or configure via `DATABASE_NAME`)

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/monorepo_dev
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=monorepo_dev
```

### Running with Docker

Start PostgreSQL using Docker Compose:

```bash
docker-compose up -d postgres
```

### Database Migrations

#### Run migrations

```bash
npm run migration:run
```

#### Generate new migration

```bash
npm run migration:generate -- src/migrations/MigrationName
```

#### Revert last migration

```bash
npm run migration:revert
```

#### Show migration status

```bash
npm run migration:show
```

## Development

### Start development server

```bash
npm run dev
```

### Build application

```bash
npm run build
```

### Run tests

```bash
npm test
```

## API Endpoints

- `GET /` - Hello message
- `GET /health` - Health check with database status
- `GET /test-user-entity` - Test User entity CRUD operations

## Database Entities

### User Entity

- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `firstName` (String)
- `lastName` (String)
- `bio` (String, Optional)
- `isActive` (Boolean, Default: true)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

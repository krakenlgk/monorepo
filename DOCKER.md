# Docker Development Environment

This document explains how to use Docker for local development of the fullstack monorepo.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development without Docker)

## Quick Start

### Start the development environment with Docker:

```bash
# Start PostgreSQL and backend services
npm run docker:dev

# View logs
npm run docker:logs

# Stop services
npm run docker:down
```

### Available Docker Commands

```bash
# Development
npm run docker:dev              # Start services in detached mode
npm run docker:dev:build        # Start services and rebuild images
npm run docker:down             # Stop services
npm run docker:down:volumes     # Stop services and remove volumes
npm run docker:restart          # Restart services
npm run docker:restart:build    # Restart services with rebuild

# Logs
npm run docker:logs             # View all service logs
npm run docker:logs:backend     # View backend logs only
npm run docker:logs:postgres    # View PostgreSQL logs only

# Cleanup
npm run docker:clean            # Stop services, remove volumes and cleanup
```

## Services

### PostgreSQL Database
- **Port**: 5432
- **Database**: monorepo_dev
- **Username**: postgres
- **Password**: password
- **Container**: monorepo-postgres

### Backend (Nest.js)
- **Port**: 3001
- **Container**: monorepo-backend
- **GraphQL Playground**: http://localhost:3001/graphql
- **Environment**: Development mode with hot reloading

## Development Workflows

### Option 1: Full Docker Development
Run both database and backend in Docker:

```bash
npm run docker:dev
# Backend available at http://localhost:3001
# Frontend runs locally: npm run dev:frontend
```

### Option 2: Database Only in Docker
Run only PostgreSQL in Docker, backend locally:

```bash
# Start only PostgreSQL
docker-compose up -d postgres

# Run backend locally
npm run dev:backend-only
```

### Option 3: Hybrid Development
Mix of Docker and local services based on your preference.

## Environment Variables

The backend service uses these environment variables in Docker:

- `NODE_ENV=development`
- `DATABASE_HOST=postgres` (Docker service name)
- `DATABASE_PORT=5432`
- `DATABASE_USERNAME=postgres`
- `DATABASE_PASSWORD=password`
- `DATABASE_NAME=monorepo_dev`
- `PORT=3001`
- `FRONTEND_URL=http://localhost:3000`

## Volumes and Data Persistence

- **PostgreSQL Data**: Persisted in Docker volume `postgres_data`
- **Application Code**: Mounted as volume for hot reloading
- **Node Modules**: Separate volumes to avoid conflicts

## Troubleshooting

### Port Conflicts
If ports 3001 or 5432 are already in use:

```bash
# Check what's using the ports
lsof -i :3001
lsof -i :5432

# Stop conflicting services or modify docker-compose.yml ports
```

### Database Connection Issues
```bash
# Check PostgreSQL health
docker-compose exec postgres pg_isready -U postgres

# View PostgreSQL logs
npm run docker:logs:postgres

# Reset database
npm run docker:down:volumes
npm run docker:dev
```

### Backend Build Issues
```bash
# Rebuild backend image
npm run docker:restart:build

# View backend logs
npm run docker:logs:backend

# Access backend container
docker-compose exec backend sh
```

### Clean Slate
If you encounter persistent issues:

```bash
# Complete cleanup and restart
npm run docker:clean
npm run docker:dev:build
```

## Production Considerations

The Dockerfile includes a production stage optimized for deployment:

- Multi-stage build for smaller image size
- Non-root user for security
- Health checks
- Only production dependencies

To build for production:

```bash
docker build -f packages/backend/Dockerfile --target production -t monorepo-backend:prod .
```
# Fullstack Monorepo

A modern fullstack monorepo built with Next.js, Nest.js, PostgreSQL, and GraphQL. This project demonstrates a complete development setup with shared utilities, consistent tooling, and streamlined workflows.

## 🏗️ Architecture

- **Frontend**: Next.js 14+ with TypeScript and Apollo Client
- **Backend**: Nest.js with GraphQL and TypeORM
- **Database**: PostgreSQL
- **Shared**: Common utilities and types
- **Tooling**: ESLint, Prettier, and workspace management

## 📁 Project Structure

```
├── packages/
│   ├── frontend/          # Next.js application
│   ├── backend/           # Nest.js GraphQL API
│   └── shared/            # Shared utilities and types
├── package.json           # Root workspace configuration
├── tsconfig.json          # Base TypeScript config
├── .eslintrc.js          # ESLint configuration
├── .prettierrc           # Prettier configuration
├── docker-compose.yml    # PostgreSQL development setup
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Docker (for PostgreSQL)

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd fullstack-monorepo
   npm install
   ```

2. **Start PostgreSQL database**
   ```bash
   docker-compose up -d
   ```

3. **Set up environment variables**
   ```bash
   cp packages/backend/.env.example packages/backend/.env
   ```

4. **Run database migrations**
   ```bash
   npm run backend:migration:run
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

This will start:
- Frontend: http://localhost:3000
- Backend GraphQL API: http://localhost:4000/graphql
- GraphQL Playground: http://localhost:4000/graphql

## 🛠️ Development

### Available Scripts

```bash
# Development - Concurrent execution with automatic environment setup
npm run dev                    # Start all services (shared, backend, frontend)
npm run dev:frontend-only      # Start only frontend with env setup
npm run dev:backend-only       # Start only backend with env setup
npm run dev:frontend           # Start frontend only
npm run dev:backend            # Start backend only
npm run dev:shared             # Start shared package in watch mode

# Building - Sequential builds with proper dependencies
npm run build                  # Build all packages in correct order
npm run build:prod             # Production build with NODE_ENV=production
npm run build:frontend         # Build frontend only
npm run build:backend          # Build backend only
npm run build:shared           # Build shared package only

# Production
npm run start                  # Start both applications in production mode
npm run start:frontend         # Start frontend in production mode
npm run start:backend          # Start backend in production mode

# Testing
npm run test                   # Run all tests across packages
npm run test:watch             # Run tests in watch mode
npm run test:ci                # Run tests for CI (with --if-present flag)

# Code Quality
npm run lint                   # Lint and fix all packages
npm run lint:check             # Lint without fixing
npm run format                 # Format code with Prettier
npm run format:check           # Check formatting without fixing
npm run type-check             # Type check all packages
npm run type-check:ci          # Type check for CI

# Environment Management
npm run env:setup              # Set up environment files from examples
npm run env:copy               # Copy environment files (alias)

# Database Operations
npm run db:migrate             # Run database migrations
npm run db:migrate:generate    # Generate new migration
npm run db:migrate:revert      # Revert last migration

# Maintenance
npm run clean                  # Clean build artifacts from all packages
npm run clean:all              # Clean everything including node_modules
npm run install:all            # Fresh install with shared package build
```

### Package Management

This monorepo uses npm workspaces. To add dependencies:

```bash
# Add to specific package
npm install <package> -w packages/frontend
npm install <package> -w packages/backend
npm install <package> -w packages/shared

# Add to root (development dependencies)
npm install <package> -D
```

## 🗄️ Database

### Entity Management

Entities are defined in `packages/backend/src/entities/` using TypeORM decorators:

```typescript
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

### Migrations

```bash
# Generate migration after entity changes
npm run backend:migration:generate -- -n CreateUserTable

# Run migrations
npm run backend:migration:run

# Revert last migration
npm run backend:migration:revert
```

## 🔌 GraphQL API

The backend provides a GraphQL API with:

- **Code-first schema generation** using Nest.js decorators
- **Type-safe resolvers** with TypeScript
- **GraphQL Playground** for development and testing

### Example Query

```graphql
query GetUsers {
  users {
    id
    email
    username
    createdAt
  }
}

mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    email
    username
  }
}
```

## 🎨 Frontend

The Next.js frontend includes:

- **App Router** for modern routing
- **Apollo Client** for GraphQL integration
- **TypeScript** for type safety
- **Shared types** from the shared package

### GraphQL Integration

```typescript
import { useQuery } from '@apollo/client';
import { GET_USERS } from '../graphql/queries';

export function UserList() {
  const { data, loading, error } = useQuery(GET_USERS);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <ul>
      {data.users.map(user => (
        <li key={user.id}>{user.email}</li>
      ))}
    </ul>
  );
}
```

## 📦 Shared Package

The shared package contains:

- **Common types** used by both frontend and backend
- **Utility functions** for data validation and transformation
- **Constants** and configuration values

```typescript
// packages/shared/src/types.ts
export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
}

// packages/shared/src/utils.ts
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Integration Tests

Backend integration tests use a test database:

```bash
npm run backend:test:e2e
```

## 🐳 Docker

### Development Database

```bash
# Start PostgreSQL
docker-compose up -d

# Stop and remove
docker-compose down
```

### Production Build

```bash
# Build Docker image
docker build -t fullstack-monorepo .

# Run container
docker run -p 3000:3000 -p 4000:4000 fullstack-monorepo
```

## 🔧 Configuration

### Environment Variables

Backend environment variables (`.env`):

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=fullstack_db
JWT_SECRET=your-jwt-secret
```

### TypeScript Configuration

The project uses a base TypeScript configuration with package-specific extensions:

- `tsconfig.json` - Base configuration
- `packages/*/tsconfig.json` - Package-specific configs

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Environment Setup

1. Set production environment variables
2. Run database migrations
3. Build and start applications

```bash
npm run backend:migration:run
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

### Code Quality

This project enforces code quality through:

- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for pre-commit hooks
- **TypeScript** for type checking

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**Database connection failed**
- Ensure PostgreSQL is running: `docker-compose up -d`
- Check environment variables in `.env`

**GraphQL schema errors**
- Restart the backend server
- Check entity decorators and resolver definitions

**Frontend build errors**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run type-check`

**Port conflicts**
- Frontend (3000) and Backend (4000) ports must be available
- Change ports in respective configuration files if needed

For more help, check the individual package README files or open an issue.
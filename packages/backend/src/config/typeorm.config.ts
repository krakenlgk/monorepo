import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from '../entities/user.entity';
import { CreateUserTable1642000000000 } from '../migrations/1642000000000-CreateUserTable';

// Load environment variables
config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DATABASE_HOST', 'localhost'),
  port: configService.get<number>('DATABASE_PORT', 5432),
  username: configService.get('DATABASE_USERNAME', 'postgres'),
  password: configService.get('DATABASE_PASSWORD', 'password'),
  database: configService.get('DATABASE_NAME', 'monorepo_dev'),
  entities: [User],
  migrations: [CreateUserTable1642000000000],
  synchronize: false, // Always false for migrations
  logging: ['query', 'error'],
});

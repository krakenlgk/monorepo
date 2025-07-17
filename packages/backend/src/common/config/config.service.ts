import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  get port(): number {
    return this.configService.get<number>('PORT', 3001);
  }

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV', 'development');
  }

  get frontendUrl(): string {
    return this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  // Database configuration getters
  get databaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL', 'postgresql://postgres:password@localhost:5432/monorepo_dev');
  }

  get databaseHost(): string {
    return this.configService.get<string>('DATABASE_HOST', 'localhost');
  }

  get databasePort(): number {
    return this.configService.get<number>('DATABASE_PORT', 5432);
  }

  get databaseUsername(): string {
    return this.configService.get<string>('DATABASE_USERNAME', 'postgres');
  }

  get databasePassword(): string {
    return this.configService.get<string>('DATABASE_PASSWORD', 'password');
  }

  get databaseName(): string {
    return this.configService.get<string>('DATABASE_NAME', 'monorepo_dev');
  }

  get typeOrmConfig(): TypeOrmModuleOptions {
    // Use individual connection parameters for better flexibility
    const config: TypeOrmModuleOptions = {
      type: 'postgres',
      host: this.databaseHost,
      port: this.databasePort,
      username: this.databaseUsername,
      password: this.databasePassword,
      database: this.databaseName,
      autoLoadEntities: true,
      synchronize: this.isDevelopment,
      logging: this.isDevelopment ? ['query', 'error'] : ['error'],
      ssl: this.isProduction ? { rejectUnauthorized: false } : false,
      retryAttempts: 3,
      retryDelay: 3000,
    };

    // If DATABASE_URL is provided, it takes precedence
    const databaseUrl = this.configService.get<string>('DATABASE_URL');
    if (databaseUrl && databaseUrl !== 'postgresql://postgres:password@localhost:5432/monorepo_dev') {
      return {
        ...config,
        url: databaseUrl,
        // Remove individual connection params when using URL
        host: undefined,
        port: undefined,
        username: undefined,
        password: undefined,
        database: undefined,
      };
    }

    return config;
  }
}
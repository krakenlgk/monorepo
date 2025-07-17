import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const isDevelopment = configService.get('NODE_ENV', 'development') === 'development';
        const isProduction = configService.get('NODE_ENV', 'development') === 'production';
        
        const config: TypeOrmModuleOptions = {
          type: 'postgres',
          host: configService.get('DATABASE_HOST', 'localhost'),
          port: configService.get<number>('DATABASE_PORT', 5432),
          username: configService.get('DATABASE_USERNAME', 'postgres'),
          password: configService.get('DATABASE_PASSWORD', 'password'),
          database: configService.get('DATABASE_NAME', 'monorepo_dev'),
          autoLoadEntities: true,
          synchronize: isDevelopment,
          logging: isDevelopment ? ['query', 'error'] : ['error'],
          ssl: isProduction ? { rejectUnauthorized: false } : false,
          retryAttempts: 1,
          retryDelay: 1000,
        };

        // If DATABASE_URL is provided, it takes precedence
        const databaseUrl = configService.get<string>('DATABASE_URL');
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
      },
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
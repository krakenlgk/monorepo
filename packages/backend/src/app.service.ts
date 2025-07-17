import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private usersService: UsersService,
  ) {}

  getHello(): string {
    return 'Hello from Nest.js Backend!';
  }

  async getHealthCheck() {
    const baseHealth = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'backend',
    };

    try {
      // Test database connection
      await this.dataSource.query('SELECT 1');
      
      // Test User entity table exists
      const userCount = await this.usersService.count();
      
      return {
        ...baseHealth,
        database: {
          status: 'connected',
          type: 'postgresql',
          entities: {
            users: {
              status: 'accessible',
              count: userCount,
            },
          },
        },
      };
    } catch (error) {
      return {
        ...baseHealth,
        status: 'degraded',
        database: {
          status: 'disconnected',
          error: error instanceof Error ? error.message : 'Unknown database error',
        },
      };
    }
  }

  async testUserEntity() {
    try {
      // Test creating a user
      const testUser = await this.usersService.create({
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        bio: 'This is a test user created to verify database functionality',
      });

      // Test finding the user
      const foundUser = await this.usersService.findByEmail('test@example.com');
      
      // Clean up - remove the test user
      if (foundUser) {
        await this.usersService.remove(foundUser.id);
      }

      return {
        success: true,
        message: 'User entity test completed successfully',
        testUser: {
          created: !!testUser,
          found: !!foundUser,
          cleaned: true,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'User entity test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
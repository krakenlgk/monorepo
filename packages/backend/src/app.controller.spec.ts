import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getDataSourceToken } from '@nestjs/typeorm';
import { UsersService } from './users/users.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const mockDataSource = {
      query: jest.fn().mockResolvedValue([]),
    };

    const mockUsersService = {
      count: jest.fn().mockResolvedValue(0),
      create: jest.fn(),
      findByEmail: jest.fn(),
      remove: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: getDataSourceToken(),
          useValue: mockDataSource,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello from Nest.js Backend!"', () => {
      expect(appController.getHello()).toBe('Hello from Nest.js Backend!');
    });
  });

  describe('health', () => {
    it('should return health status', async () => {
      const result = await appController.getHealth();
      expect(result.status).toBe('ok');
      expect(result.service).toBe('backend');
      expect(result.timestamp).toBeDefined();
      expect(result.database).toBeDefined();
    });
  });
});

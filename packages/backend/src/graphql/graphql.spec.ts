import { Test, TestingModule } from '@nestjs/testing';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import { AppResolver } from './resolvers/app.resolver';
import { join } from 'path';

describe('GraphQL Setup', () => {
  let module: TestingModule;
  let appResolver: AppResolver;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn().mockReturnValue('test'),
    };

    module = await Test.createTestingModule({
      imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: join(
            process.cwd(),
            'packages/backend/src/test-schema.gql'
          ),
          sortSchema: true,
        }),
      ],
      providers: [
        AppResolver,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    appResolver = module.get<AppResolver>(AppResolver);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(appResolver).toBeDefined();
  });

  it('should return hello message', () => {
    expect(appResolver.hello()).toBe('Hello from GraphQL!');
  });

  it('should return version', () => {
    expect(appResolver.version()).toBe('1.0.0');
  });
});

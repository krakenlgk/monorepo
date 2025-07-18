import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import { AppResolver } from './resolvers/app.resolver';
import { join } from 'path';
import * as fs from 'fs';

describe('GraphQL Schema Generation', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeAll(async () => {
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

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    // Clean up test schema file
    const schemaPath = join(
      process.cwd(),
      'packages/backend/src/test-schema.gql'
    );
    if (fs.existsSync(schemaPath)) {
      fs.unlinkSync(schemaPath);
    }
    await app.close();
  });

  it('should generate GraphQL schema file', async () => {
    const schemaPath = join(
      process.cwd(),
      'packages/backend/src/test-schema.gql'
    );

    // Wait a bit for schema generation
    await new Promise(resolve => setTimeout(resolve, 1000));

    expect(fs.existsSync(schemaPath)).toBe(true);

    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    expect(schemaContent).toContain('type Query');
    expect(schemaContent).toContain('hello: String!');
    expect(schemaContent).toContain('version: String!');
  });
});

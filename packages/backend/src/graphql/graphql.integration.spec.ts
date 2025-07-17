import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';

describe('GraphQL Integration (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should return hello message', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: '{ hello }',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.hello).toBe('Hello from GraphQL!');
      });
  });

  it('should return version', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: '{ version }',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.version).toBe('1.0.0');
      });
  });

  it('should support introspection', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: '{ __schema { types { name } } }',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.__schema.types).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ name: 'Query' }),
            expect.objectContaining({ name: 'String' }),
          ])
        );
      });
  });
});
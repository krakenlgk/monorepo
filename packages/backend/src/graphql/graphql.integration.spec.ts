import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

describe('GraphQL Integration (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User)
    );

    // Clean up database before each test
    await userRepository.clear();
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
      .expect(res => {
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
      .expect(res => {
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
      .expect(res => {
        expect(res.body.data.__schema.types).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ name: 'Query' }),
            expect.objectContaining({ name: 'String' }),
          ])
        );
      });
  });

  describe('User GraphQL Operations', () => {
    it('should create a new user', async () => {
      const createUserMutation = `
        mutation CreateUser($input: CreateUserInput!) {
          createUser(input: $input) {
            id
            email
            firstName
            lastName
            bio
            isActive
            createdAt
            updatedAt
          }
        }
      `;

      const variables = {
        input: {
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          bio: 'Test user bio',
        },
      };

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: createUserMutation,
          variables,
        })
        .expect(200);

      expect(response.body.data.createUser).toMatchObject({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Test user bio',
        isActive: true,
      });
      expect(response.body.data.createUser.id).toBeDefined();
      expect(response.body.data.createUser.createdAt).toBeDefined();
      expect(response.body.data.createUser.updatedAt).toBeDefined();
    });

    it('should fetch all users', async () => {
      // Create test users
      await userRepository.save([
        {
          email: 'user1@example.com',
          firstName: 'User',
          lastName: 'One',
          bio: 'First user',
        },
        {
          email: 'user2@example.com',
          firstName: 'User',
          lastName: 'Two',
          bio: 'Second user',
        },
      ]);

      const usersQuery = `
        query GetUsers {
          users {
            id
            email
            firstName
            lastName
            bio
            isActive
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: usersQuery })
        .expect(200);

      expect(response.body.data.users).toHaveLength(2);
      expect(response.body.data.users).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            email: 'user1@example.com',
            firstName: 'User',
            lastName: 'One',
          }),
          expect.objectContaining({
            email: 'user2@example.com',
            firstName: 'User',
            lastName: 'Two',
          }),
        ])
      );
    });

    it('should fetch a user by id', async () => {
      const user = await userRepository.save({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Test user',
      });

      const userQuery = `
        query GetUser($id: ID!) {
          user(id: $id) {
            id
            email
            firstName
            lastName
            bio
            isActive
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: userQuery,
          variables: { id: user.id },
        })
        .expect(200);

      expect(response.body.data.user).toMatchObject({
        id: user.id,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Test user',
        isActive: true,
      });
    });

    it('should fetch a user by email', async () => {
      await userRepository.save({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Test user',
      });

      const userByEmailQuery = `
        query GetUserByEmail($email: String!) {
          userByEmail(email: $email) {
            id
            email
            firstName
            lastName
            bio
            isActive
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: userByEmailQuery,
          variables: { email: 'test@example.com' },
        })
        .expect(200);

      expect(response.body.data.userByEmail).toMatchObject({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Test user',
        isActive: true,
      });
    });

    it('should update a user', async () => {
      const user = await userRepository.save({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Original bio',
      });

      const updateUserMutation = `
        mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
          updateUser(id: $id, input: $input) {
            id
            email
            firstName
            lastName
            bio
            isActive
          }
        }
      `;

      const variables = {
        id: user.id,
        input: {
          firstName: 'Jane',
          lastName: 'Smith',
          bio: 'Updated bio',
        },
      };

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: updateUserMutation,
          variables,
        })
        .expect(200);

      expect(response.body.data.updateUser).toMatchObject({
        id: user.id,
        email: 'test@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        bio: 'Updated bio',
        isActive: true,
      });
    });

    it('should delete a user', async () => {
      const user = await userRepository.save({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Test user',
      });

      const deleteUserMutation = `
        mutation DeleteUser($id: ID!) {
          deleteUser(id: $id)
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: deleteUserMutation,
          variables: { id: user.id },
        })
        .expect(200);

      expect(response.body.data.deleteUser).toBe(true);

      // Verify user is deleted
      const deletedUser = await userRepository.findOne({
        where: { id: user.id },
      });
      expect(deletedUser).toBeNull();
    });

    it('should return null for non-existent user', async () => {
      const userQuery = `
        query GetUser($id: ID!) {
          user(id: $id) {
            id
            email
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: userQuery,
          variables: { id: '123e4567-e89b-12d3-a456-426614174000' },
        })
        .expect(200);

      expect(response.body.data.user).toBeNull();
    });
  });
});

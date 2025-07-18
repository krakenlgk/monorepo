import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UsersService } from '../../users/users.service';
import { CreateUserInput, UpdateUserInput } from '../types/user.types';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let usersService: UsersService;

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    bio: 'Test bio',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUsersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [mockUser];
      mockUsersService.findAll.mockResolvedValue(users);

      const result = await resolver.findAll();

      expect(result).toEqual(users);
      expect(usersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await resolver.findOne(mockUser.id);

      expect(result).toEqual(mockUser);
      expect(usersService.findOne).toHaveBeenCalledWith(mockUser.id);
    });

    it('should return null if user not found', async () => {
      mockUsersService.findOne.mockResolvedValue(null);

      const result = await resolver.findOne('nonexistent-id');

      expect(result).toBeNull();
      expect(usersService.findOne).toHaveBeenCalledWith('nonexistent-id');
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      const result = await resolver.findByEmail(mockUser.email);

      expect(result).toEqual(mockUser);
      expect(usersService.findByEmail).toHaveBeenCalledWith(mockUser.email);
    });
  });

  describe('createUser', () => {
    it('should create and return a new user', async () => {
      const createUserInput: CreateUserInput = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Test bio',
      };
      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await resolver.createUser(createUserInput);

      expect(result).toEqual(mockUser);
      expect(usersService.create).toHaveBeenCalledWith(createUserInput);
    });
  });

  describe('updateUser', () => {
    it('should update and return the user', async () => {
      const updateUserInput: UpdateUserInput = {
        firstName: 'Jane',
        lastName: 'Smith',
      };
      const updatedUser = { ...mockUser, ...updateUserInput };
      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await resolver.updateUser(mockUser.id, updateUserInput);

      expect(result).toEqual(updatedUser);
      expect(usersService.update).toHaveBeenCalledWith(
        mockUser.id,
        updateUserInput
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete user and return true', async () => {
      mockUsersService.remove.mockResolvedValue(undefined);

      const result = await resolver.deleteUser(mockUser.id);

      expect(result).toBe(true);
      expect(usersService.remove).toHaveBeenCalledWith(mockUser.id);
    });

    it('should return false if deletion fails', async () => {
      mockUsersService.remove.mockRejectedValue(new Error('Delete failed'));

      const result = await resolver.deleteUser(mockUser.id);

      expect(result).toBe(false);
      expect(usersService.remove).toHaveBeenCalledWith(mockUser.id);
    });
  });
});

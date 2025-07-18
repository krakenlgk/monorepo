import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UsersService } from '../../users/users.service';
import {
  UserType,
  CreateUserInput,
  UpdateUserInput,
} from '../types/user.types';

@Resolver(() => UserType)
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UserType], { name: 'users' })
  async findAll(): Promise<UserType[]> {
    return this.usersService.findAll();
  }

  @Query(() => UserType, { name: 'user', nullable: true })
  async findOne(
    @Args('id', { type: () => ID }) id: string
  ): Promise<UserType | null> {
    return this.usersService.findOne(id);
  }

  @Query(() => UserType, { name: 'userByEmail', nullable: true })
  async findByEmail(@Args('email') email: string): Promise<UserType | null> {
    return this.usersService.findByEmail(email);
  }

  @Mutation(() => UserType)
  async createUser(@Args('input') input: CreateUserInput): Promise<UserType> {
    return this.usersService.create(input);
  }

  @Mutation(() => UserType, { nullable: true })
  async updateUser(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateUserInput
  ): Promise<UserType | null> {
    return this.usersService.update(id, input);
  }

  @Mutation(() => Boolean)
  async deleteUser(
    @Args('id', { type: () => ID }) id: string
  ): Promise<boolean> {
    try {
      await this.usersService.remove(id);
      return true;
    } catch (error) {
      return false;
    }
  }
}

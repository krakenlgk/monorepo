import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';
import type { User as SharedUser, CreateUserInput as SharedCreateUserInput, UpdateUserInput as SharedUpdateUserInput } from '@monorepo/shared';

@ObjectType()
export class UserType implements SharedUser {
  @Field(() => ID)
  id!: string;

  @Field()
  email!: string;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field({ nullable: true })
  bio?: string;

  @Field()
  isActive!: boolean;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@InputType()
export class CreateUserInput implements SharedCreateUserInput {
  @Field()
  email!: string;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field({ nullable: true })
  bio?: string;
}

@InputType()
export class UpdateUserInput implements SharedUpdateUserInput {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  isActive?: boolean;
}
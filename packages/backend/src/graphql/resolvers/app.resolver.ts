import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query(() => String)
  hello(): string {
    return 'Hello from GraphQL!';
  }

  @Query(() => String)
  version(): string {
    return '1.0.0';
  }
}
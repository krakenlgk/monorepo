import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { join } from 'path';
import { AppResolver } from './resolvers/app.resolver';
import { UserResolver } from './resolvers/user.resolver';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (configService: ConfigService) => ({
        autoSchemaFile: join(__dirname, '../schema.gql'),
        sortSchema: true,
        playground: configService.get('NODE_ENV') === 'development',
        introspection: true,
        context: ({ req, res }: { req: Request; res: Response }) => ({
          req,
          res,
        }),
        formatError: error => {
          // eslint-disable-next-line no-console
          console.error('GraphQL Error:', error);
          return {
            message: error.message,
            code: error.extensions?.code,
            path: error.path,
          };
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AppResolver, UserResolver],
})
export class GraphqlModule {}

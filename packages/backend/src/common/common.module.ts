import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigService } from './config/config.service';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    DatabaseModule,
  ],
  providers: [ConfigService],
  exports: [ConfigService, DatabaseModule],
})
export class CommonModule {}

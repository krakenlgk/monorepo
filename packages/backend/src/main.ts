import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './common/config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  
  // Enable CORS for frontend communication
  app.enableCors({
    origin: configService.frontendUrl,
    credentials: true,
  });

  const port = configService.port;
  await app.listen(port);
  
  console.log(`🚀 Backend server running on http://localhost:${port}`);
  console.log(`📝 Environment: ${configService.nodeEnv}`);
}

bootstrap();
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger(AppModule.name);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties not in the DTO
      forbidNonWhitelisted: true, // throws error for unknown properties
      transform: true, // auto-transforms payloads to DTO instances
    }),
  );
  app.enableCors();
  app.enableShutdownHooks();
  app.use(helmet());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Bluebricks Blueprints API')
    .setDescription('Bluebricks Blueprints Manager Service')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  logger.log(`App running on http://localhost:${port}`);
}

bootstrap();

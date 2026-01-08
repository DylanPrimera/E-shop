import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // to ransform DTOS
      transformOptions: {
        exposeUnsetFields: false,
        enableImplicitConversion: true, // help to know the type of the DTO
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

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
  const config = new DocumentBuilder()
    .setTitle('E Shop RESTful API')
    .setDescription('E-Shop endpoints documentation and testing')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();

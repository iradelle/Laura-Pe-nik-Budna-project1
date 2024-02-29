import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  // // setup to display files
  // app.use('/files', express.static('files')) // v tem diru bojo vsi file-i.. ustvarjen bo avtomatsko

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);

  console.log(`App is listening on port ${await app.getUrl()}.`);

  // console.log(`Server listening on port ${PORT}.\nNavigate to http://localhost:${PORT}/`)
}
bootstrap();

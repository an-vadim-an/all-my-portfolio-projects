import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Разрешить CORS только для вашего фронтенд-приложения
  app.enableCors({
    origin: 'http://localhost:5173', // Укажите точный адрес вашего фронтенда
    methods: 'GET,POST,PUT,DELETE', // Разрешенные методы
    allowedHeaders: 'Content-Type, Authorization', // Разрешенные заголовки
  });

  await app.listen(3000);
}

bootstrap();

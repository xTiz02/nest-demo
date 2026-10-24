import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para permitir peticiones desde cualquier cliente / frontend
  app.enableCors();

  // Validación y transformación global de DTOs en todos los endpoints
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en los DTOs
      forbidNonWhitelisted: false, // Permite ignorar campos extra o lanzar error si es true
      transform: true, // Convierte automáticamente tipos de Query/Body según DTO
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`\n🚀 Servidor NestJS iniciado exitosamente en: http://localhost:${port}`);
  console.log(`📡 Panel de pruebas interactivo disponible en: http://localhost:${port}\n`);
}

await bootstrap();

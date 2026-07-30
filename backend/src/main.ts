import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';

async function iniciar() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PUERTO_SERVIDOR || 3000);
  console.log('Servidor corriendo en el puerto 3000 🚀');
}
iniciar();
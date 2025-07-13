import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar el adaptador de Socket.IO ANTES de configurar CORS
  app.useWebSocketAdapter(new IoAdapter(app));

  // Habilitar CORS para HTTP
  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
  });

  console.log('🔧 About to start listening on port 3000...');
  await app.listen(3000);
  console.log('🚀 Server running on http://localhost:3000');
  console.log('🔌 WebSocket server should be available at ws://localhost:3000');

  // Verificar que el servidor WebSocket esté disponible
  setTimeout(() => {
    console.log('🔍 Checking if Socket.IO endpoint is available...');
  }, 2000);
}
bootstrap();

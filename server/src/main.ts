import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { JsonRpcWsAdapter } from './adapters/json-rpc-ws-adapter';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const port = process.env.PORT ?? 3001;
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useWebSocketAdapter(new JsonRpcWsAdapter(app));
  app.enableCors({ credentials: true, origin: true });
  app.use(cookieParser());
  await app.listen(port);
}
bootstrap();

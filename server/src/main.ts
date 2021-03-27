import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import 'dotenv/config';
import { JsonRpcWsAdapter } from './adapters/json-rpc-ws-adapter';
import * as cookieParser from 'cookie-parser';

async function bootstrap(): Promise<void> {
  const port = process.env.PORT ? process.env.PORT : 3001;
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new JsonRpcWsAdapter(app));
  app.enableCors({ credentials: true, origin: true });
  app.use(cookieParser());
  await app.listen(port);
}
bootstrap();

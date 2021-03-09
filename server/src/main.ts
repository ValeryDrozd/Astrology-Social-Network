import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import 'dotenv/config';

async function bootstrap(): Promise<void> {
  const port = process.env.PORT ? process.env.PORT : 3001;
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { PORT } from './config/environment';
import { Logger } from '@nestjs/common';

const port = PORT || 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  Logger.log(`Server running on http://localhost:${port}`, 'Bootstrap')
}
bootstrap();

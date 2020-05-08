import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { PORT } from './config/environment';
import { Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filter/http-error.filter';
import { ValidationPipe } from './common/pipe/validation.pipe';

const port = PORT || 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter);

  await app.listen(port);
  Logger.log(`Server running on http://localhost:${port}`, 'Bootstrap')
}
bootstrap();

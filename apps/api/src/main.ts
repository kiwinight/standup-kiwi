import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.development.local' });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'development') {
    app.enableCors({
      origin: '*',
    });
  }

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  console.log(`\x1b[1;32mApplication is running on port ${port}\x1b[0m`);
}
bootstrap();

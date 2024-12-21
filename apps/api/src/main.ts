import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  console.log(`\x1b[1;32mApplication is running on port ${port}\x1b[0m`);
}
bootstrap();

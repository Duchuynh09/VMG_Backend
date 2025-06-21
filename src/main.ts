import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// Sau này để thành middleWare
import * as cookieParser from 'cookie-parser';

declare const module: any
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true, logger: ['error', 'warn'] });
  app.use(cookieParser());
  // Nếu dùng CORS
  app.enableCors({
    origin: 'http://localhost:3000', // or your frontend domain
    credentials: true,              // allow cookies
  });
  await app.listen(process.env.PORT ?? 3000);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close())
  }
  console.log(`Server is running on port ${process.env.PORT ?? 3000}`);
}
bootstrap();

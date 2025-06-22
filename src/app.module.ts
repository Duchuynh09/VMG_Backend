// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { ProductConfigurationModule } from './product-configuration/product-configuration.module';
import { AuthModule } from './auth/auth.module';
import { WorkersModule } from './worker/woker.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // Thay đổi 'garment_price_db' thành 'VMG'
    MongooseModule.forRoot(
      process.env.CONNECT_STRING || 'mongodb://127.0.0.1:27017/VMG'
      , {
        // Các tùy chọn Mongoose (có thể bỏ qua nếu dùng phiên bản mới)
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
      }),

    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    // ProductTypeModule,
    // ProcessDetailModule,
    AuthModule,
    WorkersModule,
    // ProductConfigurationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
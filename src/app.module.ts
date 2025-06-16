// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductTypeModule } from './product-type/product-type.module';
import { ProcessDetailModule } from './process-detail/process-detail.module';
// import { ProductConfigurationModule } from './product-configuration/product-configuration.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Thay đổi 'garment_price_db' thành 'VMG'
    MongooseModule.forRoot('mongodb://localhost:27017/VMG', {
      // Các tùy chọn Mongoose (có thể bỏ qua nếu dùng phiên bản mới)
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    }),
    ProductTypeModule,
    ProcessDetailModule,
    AuthModule,
    // ProductConfigurationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
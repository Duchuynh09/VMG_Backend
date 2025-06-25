
import { Module } from '@nestjs/common';
import { UsersService } from './woker.service';
import { UsersController } from './worker.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkerProfile, WorkerProfileShema } from './schemas/worker.schema';
import { Operation, OperationSchema } from 'src/worker/schemas/operation.shema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: WorkerProfile.name, schema: WorkerProfileShema
      },
      {
        name: Operation.name, schema: OperationSchema
      }
    ])
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class WorkersModule { }

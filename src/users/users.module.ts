
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Operation, OperationSchema } from 'src/operations/schemas/operation.shema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name, schema: UserSchema
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
export class UsersModule { }

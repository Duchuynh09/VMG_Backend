// src/users/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/enums/role.enum';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: [Role.Admin, Role.Employee, Role.HR, Role.Manager] })
  role: string;

  @Prop({ type: String, default: null })
  teamId: string;

  @Prop({ type: [{ productCode: String, operationId: String }], default: [] })
  primaryOperations: { productCode: string; operationId: string }[]; // công đoạn chính theo mã hàng

  @Prop({
    type: [{
      date: String,
      productCode: String,
      operationId: String,
      amount: Number,
      isPrimary: Boolean
    }], default: []
  })
  productivity: { date: string; productCode: string; operationId: string; amount: number; isPrimary: boolean }[];

  @Prop({ type: [{ date: String, startTime: String, endTime: String }], default: [] })
  workingHours: { date: string; startTime: string; endTime: string }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ username: 1 });
UserSchema.index({ teamId: 1 });
UserSchema.index({ 'productivity.date': 1 });
UserSchema.index({ 'workingHours.date': 1 });
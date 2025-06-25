// src/worker/schemas/worker-profile.schema.ts
import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { OperationLog, OperationLogSchema } from './operationLog.shema';
import { WorkingHour, WorkingHourSchema } from './workingHour.shema';

@Schema({ timestamps: true })
export class WorkerProfile extends Document {
  @Prop({ required: true }) fullName: string;
  @Prop({ required: true }) cccd: string;
  @Prop() birthDate?: Date;
  @Prop() phone?: string;
  @Prop() address?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: String, default: null })
  teamId: string;

  @Prop({
    type: [{ productCode: String, operationId: String }],
    default: [],
  })
  primaryOperations: { productCode: string; operationId: string }[];

  @Prop({ type: [OperationLogSchema], default: [] })
  productivity: OperationLog[];

  @Prop({ type: [WorkingHourSchema], default: [] })
  workingHours: WorkingHour[];
}

export const WorkerProfileSchema = SchemaFactory.createForClass(WorkerProfile);

WorkerProfileSchema.index({ fullName: 1 });
WorkerProfileSchema.index({ teamId: 1 });
WorkerProfileSchema.index({ 'productivity.date': 1 });
WorkerProfileSchema.index({ 'workingHours.date': 1 });

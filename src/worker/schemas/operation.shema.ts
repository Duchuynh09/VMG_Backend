// src/operations/schemas/operation.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Operation extends Document {
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) unitPrice: number;
  @Prop({ required: true }) productCode: string;
  @Prop() team?: string;
  @Prop({ default: 'cái' }) unit: string;
}

export const OperationSchema = SchemaFactory.createForClass(Operation);

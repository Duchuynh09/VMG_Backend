// src/users/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class OperationLog {
    @Prop({ required: true }) date: string;
    @Prop({ required: true }) productCode: string;
    @Prop({ required: true }) operationId: string;
    // amout là sản lượng
    @Prop({ required: true }) amount: number;
    // isPrimary là có phải công đoạn chính hay k
    @Prop({ default: true }) isPrimary: boolean;
}
export const OperationLogSchema = SchemaFactory.createForClass(OperationLog);
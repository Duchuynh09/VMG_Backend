// src/worker/schemas/workingHour.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class WorkingHour {
    @Prop({ required: true }) date: string;
    @Prop() startTime?: string;
    @Prop() endTime?: string;
}
export const WorkingHourSchema = SchemaFactory.createForClass(WorkingHour);
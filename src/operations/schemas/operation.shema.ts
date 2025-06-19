// src/operations/operation.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Operation extends Document {
  @Prop({ required: true })
  name: string; // tên công đoạn, ví dụ: "Quay lá cổ"

  @Prop({ required: true })
  unitPrice: number; // đơn giá, ví dụ: 500 (VND/sản phẩm)

  @Prop({ type: String })
  productCode: string; // mã hàng, ví dụ: "MS001" (áo sơ mi)
}

export const OperationSchema = SchemaFactory.createForClass(Operation);
OperationSchema.index({ productCode: 1 });
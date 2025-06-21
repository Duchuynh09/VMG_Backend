import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { WorkerProfile } from "src/worker/schemas/worker.schema";

@Schema()
export class User extends Document {
    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true })
    password: string;

    @Prop({ enum: ['WORKER', 'MANAGER', 'HR', 'TECHNICAL', 'ACCOUNTING'], default: 'WORKER' })
    role: string;

    @Prop({ type: Types.ObjectId, ref: 'WorkerProfile' })
    profile: WorkerProfile;
}

export const UserSchema = SchemaFactory.createForClass(User);

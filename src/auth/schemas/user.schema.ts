// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { WorkerProfile } from 'src/worker/schemas/worker.schema';
import { Role } from 'src/enums/role.enum';
@Schema({ timestamps: true })
// Chứa các refesh token ở mỗi thiết bị khác nhau
export class RefreshTokenEntry {
    @Prop({ required: true }) tokenHash: string; // hashed token
    @Prop() userAgent?: string;
    @Prop() ip?: string;
    @Prop({ default: Date.now }) createdAt?: Date;
}

const RefreshTokenEntrySchema = SchemaFactory.createForClass(RefreshTokenEntry);
// User shema
@Schema({ timestamps: true })
export class User extends Document {
    @Prop({ required: true, unique: true }) username: string;
    @Prop({ required: true }) password: string;
    @Prop({ enum: [Role.Accounting,Role.Admin,Role.Employee,Role.HR,Role.Manager,Role.Technical], default: Role.Employee }) role: string;
    @Prop({ type: Types.ObjectId, ref: 'WorkerProfile' }) profile: WorkerProfile;

    @Prop({ type: [RefreshTokenEntrySchema], default: [] })
    refreshTokens: RefreshTokenEntry[];
}

export const UserSchema = SchemaFactory.createForClass(User);

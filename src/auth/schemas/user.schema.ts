import { Prop,Schema,SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User extends Document {
    @Prop()
    username: string;
    @Prop()
    password: string;
    @Prop()
    email: string;
    @Prop()
    role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
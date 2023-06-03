import { HydratedDocument } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = HydratedDocument<UserClass>;

@Schema()
export class UserClass {
  @Prop({
    required: true,
    unique: true,
  })
  username: string;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    default: Date.now(),
  })
  createdAt: Date;

  @Prop()
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(UserClass);

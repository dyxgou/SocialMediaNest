import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { Image, imageRaw } from './interfaces/image.interface';
import { Post } from './post.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: User.name }] })
  followers: Array<User | Types.ObjectId>;

  @Prop({ type: [{ type: Types.ObjectId, ref: User.name }] })
  followings: Array<User | Types.ObjectId>;

  @Prop({ type: [{ type: Types.ObjectId, ref: User.name }] })
  suitors: Array<User | Types.ObjectId>;

  @Prop({ type: Types.ObjectId, ref: User.name })
  relationship: User;

  @Prop(imageRaw)
  avatar: Image;

  @Prop(imageRaw)
  cover: Image;

  @Prop({ type: [{ type: Types.ObjectId, ref: Post.name }] })
  likedPosts: Array<Types.ObjectId | Post>;

  @Prop({ type: [{ type: Types.ObjectId, ref: Post.name }] })
  dislikedPosts: Array<Types.ObjectId | Post>;
}

export const USER_SCHEMA_NAME = User.name;

export const UserSchema = SchemaFactory.createForClass(User);

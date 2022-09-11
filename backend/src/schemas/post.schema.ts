import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { User, USER_SCHEMA_NAME } from './user.schema';
import { imageRaw, Image } from './interfaces/image.interface';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: Types.ObjectId, required: true })
  userId: User | Types.ObjectId;

  @Prop({ type: String, trim: true, maxlength: 350 })
  description: string;

  @Prop(imageRaw)
  image: Image;

  @Prop({ type: [{ type: Types.ObjectId, ref: USER_SCHEMA_NAME }] })
  likes: Array<User | Types.ObjectId>;

  @Prop({ type: [{ type: Types.ObjectId, ref: USER_SCHEMA_NAME }] })
  dislikes: Array<User | Types.ObjectId>;
}

export const POST_SCHEMA_NAME = Post.name;

export const PostSchema = SchemaFactory.createForClass(Post);

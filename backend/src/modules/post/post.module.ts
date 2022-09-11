import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema, User, UserSchema } from '@schemas/index';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [
    // Mongoose Provider
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: User.name, schema: UserSchema },
    ]),
    // Cloudinary Provider
    CloudinaryModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}

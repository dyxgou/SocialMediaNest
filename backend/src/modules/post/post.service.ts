import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '@schemas/post.schema';
import { User, UserDocument } from '@schemas/user.schema';
import { Model, Types } from 'mongoose';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreatePostDto } from './dto/post.dto';

@Injectable()
export class PostService {
  constructor(
    private cloudinaryService: CloudinaryService,
    @InjectModel(Post.name) private postSchema: Model<PostDocument>,
    @InjectModel(User.name) private userSchema: Model<UserDocument>,
  ) {}

  async createPost(
    postInfo: CreatePostDto,
    userId: string,
    file: Express.Multer.File,
  ) {
    if (!postInfo.description && !file) {
      throw new NotAcceptableException('The payload given is unacceptable');
    }

    const postPayload = Object.assign(postInfo, { userId, image: {} });

    try {
      if (file) {
        const image = await this.cloudinaryService.updateImage(file);

        postPayload.image = image;
      }

      const newPost = await this.postSchema.create(postPayload);

      return newPost;
    } catch (error) {
      throw new BadRequestException({ error }, 'Error creating this post');
    }
  }

  async deletePost(postId: string, userId: string) {
    const post = await this.postSchema.findById(postId, {
      userId: true,
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const userIdObject = new Types.ObjectId(userId);

    if (post.userId !== userIdObject) {
      throw new UnauthorizedException(
        "You can't delete a post that you don't own",
      );
    }

    try {
      await post.deleteOne();

      return { isDeleted: true };
    } catch (error) {
      throw new BadRequestException({ error }, 'Error deleting the post');
    }
  }

  async likeAPost(postId: string, userId: string) {
    const [user, post] = await Promise.all([
      this.userSchema.findById(userId, {
        dislikedPosts: true,
      }),
      this.postSchema.findById(postId, {
        likes: true,
      }),
    ]);

    if (!post || !user) {
      throw new NotFoundException('Post or user not found');
    }

    if (user.dislikedPosts.includes(post._id)) {
      throw new NotAcceptableException(
        "You can't like a post that you've disliked",
      );
    }

    try {
      const updatedUser = user.updateOne({
        $addToSet: { likedPosts: post._id },
      });

      const updatedPost = post.updateOne({
        $addToSet: { likes: user._id },
      });

      await Promise.all([updatedUser, updatedPost]);

      return { postLikes: post.likes.length + 1 };
    } catch (error) {
      throw new BadRequestException(
        { error },
        'Error giving a like to this post',
      );
    }
  }

  async dislikeAPost(postId: string, userId: string) {
    const [user, post] = await Promise.all([
      this.userSchema.findById(userId, { likedPosts: true }),
      this.postSchema.findById(postId, { dislikes: true }),
    ]);

    if (!user || !post) {
      throw new NotFoundException('Post or user not found');
    }

    if (user.likedPosts.includes(post._id)) {
      throw new NotAcceptableException(
        "You can't dislike a post that you've liked",
      );
    }

    try {
      const updatedUser = user.updateOne({
        $addToSet: { dislikedPosts: post._id },
      });

      const updatedPost = post.updateOne({
        $addToSet: { dislikes: user._id },
      });

      await Promise.all([updatedUser, updatedPost]);

      return { postDislikes: post.likes.length - 1 };
    } catch (error) {
      throw new BadRequestException(
        { error },
        'Error giving a like to this post',
      );
    }
  }
}

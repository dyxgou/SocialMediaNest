import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUserId } from 'src/decorators/getUser.decorator';
import { fileOptions } from 'src/helpers/fileInterceptor';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { CreatePostDto } from './dto/post.dto';
import { PostService } from './post.service';

@Controller('post')
@UseGuards(JwtGuard)
export class PostController {
  constructor(private postService: PostService) {}

  // Create
  @Post('create')
  @UseInterceptors(FileInterceptor('image', fileOptions))
  createPost(
    @Body() postInfo: CreatePostDto,
    @GetUserId() userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.postService.createPost(postInfo, userId, file);
  }

  // Delete
  @Delete('delete/:postId')
  deletePost(@Param('postId') postId: string, @GetUserId() userId: string) {
    return this.postService.deletePost(postId, userId);
  }

  // Like
  @Patch('like/:postId')
  likeAPost(@Param('postId') postId: string, @GetUserId() userId: string) {
    return this.postService.likeAPost(postId, userId);
  }

  // Dislike
  @Patch('dislike/:postId')
  dislikeAPost(@Param('postId') postId: string, @GetUserId() userId: string) {
    return this.postService.dislikeAPost(postId, userId);
  }
}

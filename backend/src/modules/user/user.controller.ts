import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUserId } from 'src/decorators/getUser.decorator';
import { fileOptions } from 'src/helpers/fileInterceptor';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { UpdateUserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Patch('update')
  @UseInterceptors(FileInterceptor('image', fileOptions))
  @UseGuards(JwtGuard)
  updateUser(
    @Body() userPayload: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
    @GetUserId() userId: string,
  ) {
    return this.userService.updateUser(userPayload, file, userId);
  }

  // Get an user
  @Get('get/:userId')
  findOneUser(@Param('userId') userId: string) {
    return this.userService.findOneUser(userId);
  }
  // Follow an user
  @Patch('follow/:userId')
  @UseGuards(JwtGuard)
  followOneUser(
    @Param('userId') userIdToFollow: string,
    @GetUserId() userIdFollowing: string,
  ) {
    return this.userService.follow(userIdToFollow, userIdFollowing);
  }

  // Unfollow
  @Patch('unfollow/:userId')
  @UseGuards(JwtGuard)
  unfollowOneUser(
    @Param('userId') userIdToUnfollow: string,
    @GetUserId() userIdUnfollowing: string,
  ) {
    return this.userService.unfollow(userIdToUnfollow, userIdUnfollowing);
  }
}

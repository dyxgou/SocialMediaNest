import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@schemas/index';
import { Model } from 'mongoose';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UpdateUserDto } from './dto/user.dto';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userSchema: Model<UserDocument>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async updateUser(
    userPayload: UpdateUserDto,
    file: Express.Multer.File,
    userId: string,
  ) {
    const userInfo: Partial<User> = Object.assign(userPayload);

    if (userPayload?.password) {
      const hashedPassword = await argon.hash(userPayload.password);

      userInfo.password = hashedPassword;
      userPayload.password = 'updated';
    }

    if (userPayload?.imageType && file) {
      const fileUploaded = await this.cloudinaryService.updateImage(file);

      userInfo[userPayload.imageType] = fileUploaded;
    }

    try {
      await this.userSchema.findByIdAndUpdate(userId, {
        $set: userInfo,
      });

      return userPayload;
    } catch (error) {
      throw new BadRequestException({ error }, "Couldn't update this user");
    }
  }

  async findOneUser(userId: string) {
    const user = await this.userSchema.findById(userId, {
      password: false,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async follow(userIdToFollow: string, userIdFollowing: string) {
    if (userIdFollowing === userIdToFollow) {
      throw new BadRequestException("You can't follow yourself");
    }

    const [userFollowing, userToFollow] = await Promise.all([
      this.userSchema.findById(userIdFollowing, {
        followings: true,
      }),
      this.userSchema.findById(userIdToFollow, {
        followers: true,
      }),
    ]);

    if (!userFollowing || !userToFollow) {
      throw new NotFoundException("Some of the two hasn't been found");
    }

    try {
      const updatedUserFollowing = userFollowing.updateOne({
        $addToSet: { followings: userToFollow._id },
      });

      const updatedUserToFollow = userToFollow.updateOne({
        $addToSet: { followers: userToFollow._id },
      });

      await Promise.all([updatedUserFollowing, updatedUserToFollow]);

      return { isFollowing: true };
    } catch (error) {
      throw new BadRequestException({ error }, 'Error Following this user');
    }
  }

  async unfollow(userIdToUnfollow: string, userIdUnfollowing: string) {
    if (userIdToUnfollow === userIdUnfollowing) {
      throw new BadRequestException("You can't unfollow yourself");
    }

    const [userUnfollowing, userToUnfollow] = await Promise.all([
      this.userSchema.findById(userIdUnfollowing, {
        followings: true,
      }),
      this.userSchema.findById(userIdToUnfollow, {
        followers: true,
      }),
    ]);

    if (!userUnfollowing || !userToUnfollow) {
      throw new NotFoundException("Some of the two users hasn't been found");
    }

    try {
      const updatedUserUnfollowing = userUnfollowing.updateOne({
        $pull: { followings: userToUnfollow._id },
      });

      const updatedUserToUnfollow = userUnfollowing.updateOne({
        $pull: { followers: userUnfollowing._id },
      });

      await Promise.all([updatedUserUnfollowing, updatedUserToUnfollow]);

      return { isUnfollowing: true };
    } catch (error) {
      throw new BadRequestException({ error }, 'Error unfollowing this user');
    }
  }
}

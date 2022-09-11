import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@schemas/index';
import { Model } from 'mongoose';
import { LoginBodyDto, RegisterBodyDto, TokenPayload } from './dto/auth.dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userSchema: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async registerUser(userInfo: RegisterBodyDto) {
    // Hashing password

    const hashedPassword = await argon.hash(userInfo.password);

    userInfo.password = hashedPassword;

    // Creating the user

    try {
      const user = await this.userSchema.create(userInfo);

      return this.singToken({ id: user.id });
    } catch (error) {
      throw new BadRequestException({ error }, 'Error creating the user');
    }
  }

  async loginUser(userInfo: LoginBodyDto) {
    // Comparing the password

    const user = await this.userSchema.findOne(
      { email: userInfo.email },
      {
        password: true,
      },
    );

    const isCorrectPassword = await argon
      .verify(user.password, userInfo.password)
      .catch((err) => {
        console.log({ err });
        return false;
      });

    // Checking the credentials
    console.log({ user, isCorrectPassword });

    if (!isCorrectPassword || !user) {
      throw new UnauthorizedException('The email or password was wrong');
    }

    return this.singToken({ id: user.id });
  }

  singToken(paylaod: TokenPayload) {
    const secret = this.configService.get('JWT_SECRET');

    const access_token = this.jwtService.sign(paylaod, {
      secret,
      expiresIn: '7d',
    });

    return { access_token };
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginBodyDto, RegisterBodyDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  registerUser(@Body() userInfo: RegisterBodyDto) {
    return this.authService.registerUser(userInfo);
  }

  @Post('login')
  loginUser(@Body() userInfo: LoginBodyDto) {
    return this.authService.loginUser(userInfo);
  }
}

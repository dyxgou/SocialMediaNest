import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterBodyDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @MinLength(10)
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  username: string;
}

export class LoginBodyDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class TokenPayload {
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}

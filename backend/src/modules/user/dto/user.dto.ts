import {
  IsOptional,
  IsString,
  MinLength,
  IsAlphanumeric,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsAlphanumeric()
  @MinLength(10)
  password?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  @Matches(/^avatar$|^cover$/)
  imageType?: 'avatar' | 'cover';
}

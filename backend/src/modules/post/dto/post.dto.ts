import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
  @MaxLength(350)
  @IsString()
  @IsOptional()
  description: string;
}

import { IsString, MinLength } from 'class-validator';

export class MessageDto {
  @IsString()
  from: string;

  @IsString()
  @MinLength(1)
  message: string;
}

import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @IsInt()
  limit?: number;
  @IsOptional()
  @IsPositive()
  @IsInt()
  offset?: number;
}

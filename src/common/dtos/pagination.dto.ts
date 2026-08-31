import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  // @Type(() => Number) para transformar el valor desde el DTO
  limit?: number;

  @IsOptional()
  @IsPositive()
  @Min(0)
  offset?: number;
}

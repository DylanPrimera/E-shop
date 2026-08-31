import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    example: 10,
    description: 'Max number of items to return',
  })
  @IsOptional()
  @IsPositive()
  // @Type(() => Number) para transformar el valor desde el DTO
  limit?: number;

  @ApiProperty({
    example: 0,
    description: 'Number of items to skip (min 0)',
  })
  @IsOptional()
  @Min(0)
  offset?: number;
}

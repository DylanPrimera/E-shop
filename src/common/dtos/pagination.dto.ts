import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    default: 10,
    required: false,
    description: 'Max number of items to return',
    example: 10,
  })
  @IsOptional()
  @IsPositive()
  limit?: number;

  @ApiProperty({
    default: 0,
    required: false,
    description: 'Number of items to skip (offset)',
    example: 0,
  })
  @IsOptional()
  @Min(0)
  offset?: number;
}

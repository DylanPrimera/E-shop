import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product title (unique)',
    nullable: false,
    minLength: 1,
    example: 'Teslo Men’s Chill Crew Neck Sweatshirt',
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({
    description: 'Product price',
    required: false,
    default: 0,
    example: 75.0,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @ApiProperty({
    description: 'Product description',
    required: false,
    example: 'Introducing the Tesla Chill Collection. The Men’s Chill Crew Neck Sweatshirt has a premium, soft fleece exterior made from recycled polyester and cotton.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Product slug for SEO URL (auto-generated from title if omitted)',
    required: false,
    example: 'teslo_mens_chill_crew_neck_sweatshirt',
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({
    description: 'Available inventory stock',
    required: false,
    default: 0,
    example: 15,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  stock?: number;

  @ApiProperty({
    description: 'Available sizes for this product',
    example: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    isArray: true,
  })
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @ApiProperty({
    description: 'Target gender/audience',
    example: 'men',
    enum: ['men', 'women', 'kid', 'unisex'],
  })
  @IsString()
  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;

  @ApiProperty({
    description: 'Tags for categorization and search',
    example: ['sweatshirt', 'hoodie'],
    required: false,
    isArray: true,
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags: string[];

  @ApiProperty({
    description: 'List of product image URLs or filenames',
    example: ['1740176-00-A_0_2000.jpg', '1740176-00-A_1.jpg'],
    required: false,
    isArray: true,
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}

import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'product_images' })
export class ProductImage {
  @ApiProperty({
    example: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    description: 'Image unique ID (UUID)',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'http://localhost:3000/api/v1/files/product/image.jpg',
    description: 'Image public URL or filename',
  })
  @Column({
    type: 'text',
  })
  url: string;

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  product: Product;
}

import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ProductImage } from './product-images.entity';
import { User } from '../../auth/entities/user.entity';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    description: 'Product ID',
    example: '0fdf34a1-cac5-4ad5-9c5b-23bac0ad2681',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Product title',
    example: 'Awesome Product',
  })
  @Column('text', {
    unique: true,
  })
  title: string;

  @ApiProperty({
    description: 'Product price',
    example: 19.99,
  })
  @Column('float', {
    default: 0,
  })
  price: number;

  @ApiProperty({
    description: 'Product description',
    example: 'This is a great product!',
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @ApiProperty({
    description: 'Product slug for SEO-friendly URLs',
    example: 'product-slug',
  })
  @Column({
    type: 'text',
    unique: true,
  })
  slug: string;

  @ApiProperty({
    description: 'Product stock',
    example: 10,
  })
  @Column({
    type: 'int',
    default: 0,
  })
  stock: number;

  @ApiProperty({
    example: ['M', 'XL', 'XXL'],
    description: 'Available sizes for the product',
  })
  @Column({
    type: 'text',
    array: true,
  })
  sizes: string[];

  @ApiProperty({
    description: 'Gender of the product',
    example: 'men',
  })
  @Column({
    type: 'text',
  })
  gender: string;

  @ApiProperty({
    description: 'Tags for the product',
    example: ['casual', 'summer'],
  })
  @Column({
    type: 'text',
    array: true,
    default: [],
  })
  tags: string[];

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @ManyToOne(() => User, (user) => user.product, {
    eager: true,
  })
  user: User;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title
        .toLocaleLowerCase()
        .replaceAll(' ', '-')
        .replaceAll("'", '');
    }
    this.slug = this.slug
      .toLocaleLowerCase()
      .replaceAll(' ', '-')
      .replaceAll(/[^a-zA-Z0-9]/g, '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLocaleLowerCase()
      .replaceAll(' ', '-')
      .replaceAll(/[^a-zA-Z0-9]/g, '');
  }
}

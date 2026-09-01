import { ApiProperty } from '@nestjs/swagger';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../product/entities';

@Entity('users')
export class User {
  @ApiProperty({
    example: 'd5c2be6d-2e23-41bb-83df-211ff12e2c04',
    description: 'User unique identifier (UUID)',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
    uniqueItems: true,
  })
  @Column({
    type: 'text',
    unique: true,
  })
  email: string;

  @Column({
    type: 'text',
    select: false,
  })
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'User full name',
  })
  @Column({
    type: 'text',
  })
  fullName: string;

  @ApiProperty({
    example: true,
    description: 'Whether the user account is active',
    default: true,
  })
  @Column({
    type: 'bool',
    default: true,
  })
  isActive: boolean;

  @ApiProperty({
    example: ['user', 'admin'],
    description: 'Assigned user roles',
    default: ['user'],
    isArray: true,
  })
  @Column({
    type: 'text',
    array: true,
    default: ['user'],
  })
  roles: string[];

  @OneToMany(() => Product, (product) => product.user)
  product: Product;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}

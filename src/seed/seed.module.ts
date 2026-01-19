import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductModule } from 'src/product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [ProductModule, TypeOrmModule.forFeature([User])],
})
export class SeedModule {}

import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { ProductModule } from '../product/product.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [ProductModule, TypeOrmModule.forFeature([User])],
})
export class SeedModule {}

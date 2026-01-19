import { Injectable } from '@nestjs/common';
import { ProductService } from 'src/product/product.service';
import { initialData } from './data/dummieProducts';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class SeedService {
  dbUsers: User[] = [];
  constructor(
    private readonly productService: ProductService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.purgeDB();
    await this.insertUsers();
    await this.insertProducts();
    return 'SEED EXECUTED';
  }

  private async purgeDB() {
    await this.productService.deleteAllProducts();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;
    seedUsers.forEach((user) => {
      this.dbUsers.push(this.userRepository.create(user));
    });
    await this.userRepository.save(this.dbUsers);
  }

  private async insertProducts() {
    await this.productService.deleteAllProducts();

    const seedProducts = initialData.products;

    const insertPromises: Promise<any>[] = [];

    seedProducts.forEach((product) => {
      insertPromises.push(this.productService.create(product, this.dbUsers[0]));
    });

    await Promise.all(insertPromises);

    return true;
  }
}

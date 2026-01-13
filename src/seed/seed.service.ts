import { Injectable } from '@nestjs/common';
import { ProductService } from 'src/product/product.service';
import { initialData } from './data/dummieProducts';

@Injectable()
export class SeedService {
  constructor(private readonly productService: ProductService) {}
  async runSeed() {
    await this.insertProducts();
    return 'SEED EXCECUTED';
  }

  private async insertProducts() {
    await this.productService.deleteAllProducts();

    const seedProducts = initialData.products;

    const insertPromises: Promise<any>[] = [];

    seedProducts.forEach((product) => {
      insertPromises.push(this.productService.create(product));
    });

    await Promise.all(insertPromises);

    return true;
  }
}

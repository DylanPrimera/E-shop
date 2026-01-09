/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos';
import { validate as isUUId } from 'uuid';

@Injectable()
export class ProductService {
  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);

      await this.productRepository.save(product);

      return product;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      const products = await this.productRepository.find({
        take: limit,
        skip: offset,
        // TODO: relations
      });
      return products;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findOne(term: string) {
    let product: Product | null = null;
    if (isUUId(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder
        .where(`LOWER(title) =:title or slug =:slug`, {
          title: term.toLowerCase(),
          slug: term.toLowerCase(),
        })
        .getOne();
    }

    if (!product) throw new NotFoundException(`Product "${term}" not found`);

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.productRepository.preload({
        id: id,
        ...updateProductDto,
      });

      if (!product) throw new NotFoundException(`Product id "${id}" not found`);

      await this.productRepository.save(product);

      return product;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return `${product.title} deleted succesfully`;
  }

  private handleExceptions(error: any) {
    if (error?.code === '23505') throw new BadRequestException(error?.detail);
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}

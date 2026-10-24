import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller.js';
import { ProductsService } from './products.service.js';
import { ProductsRepository } from './products.repository.js';
import { Product } from './entities/product.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository],
  exports: [ProductsService, ProductsRepository],
})
export class ProductsModule {}

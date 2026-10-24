import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity.js';
import { FilterProductDto } from './dto/filter-product.dto.js';

@Injectable()
export class ProductsRepository extends Repository<Product> {
  constructor(private readonly dataSource: DataSource) {
    super(Product, dataSource.createEntityManager());
  }

  /**
   * Consulta personalizada para buscar productos con filtros combinados y paginación
   */
  async findAllWithFilters(filters: FilterProductDto): Promise<[Product[], number]> {
    const query = this.createQueryBuilder('product');

    // Filtro por texto en nombre o descripción
    if (filters.search) {
      query.andWhere(
        '(LOWER(product.name) LIKE :search OR LOWER(product.description) LIKE :search)',
        { search: `%${filters.search.toLowerCase()}%` },
      );
    }

    // Filtro por categoría
    if (filters.category) {
      query.andWhere('LOWER(product.category) = :category', {
        category: filters.category.toLowerCase(),
      });
    }

    // Filtro por rango de precios
    if (filters.minPrice !== undefined) {
      query.andWhere('product.price >= :minPrice', { minPrice: filters.minPrice });
    }
    if (filters.maxPrice !== undefined) {
      query.andWhere('product.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    // Paginación y orden
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    query.skip((page - 1) * limit).take(limit);
    query.orderBy('product.id', 'ASC');

    return await query.getManyAndCount();
  }

  /**
   * Buscar productos por categoría específica
   */
  async findByCategory(category: string): Promise<Product[]> {
    return await this.find({
      where: { category },
      order: { price: 'ASC' },
    });
  }
}

import {
  Injectable,
  NotFoundException,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { ProductsRepository } from './products.repository.js';
import { Product } from './entities/product.entity.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { FilterProductDto } from './dto/filter-product.dto.js';

@Injectable()
export class ProductsService implements OnModuleInit {
  private readonly logger = new Logger(ProductsService.name);

  // Inyección limpia del repositorio personalizado en archivo separado
  constructor(
    private readonly productsRepository: ProductsRepository,
  ) {}

  /**
   * Semilla inicial de datos en MySQL si la tabla está vacía
   */
  async onModuleInit() {
    const count = await this.productsRepository.count();
    if (count === 0) {
      this.logger.log('Inicializando datos de prueba en la tabla "products" de MySQL...');
      await this.productsRepository.save([
        {
          name: 'Teclado Mecánico RGB',
          description: 'Switch azul con iluminación RGB personalizable',
          price: 79.99,
          category: 'Periféricos',
          tags: ['gaming', 'teclado', 'rgb'],
          inStock: true,
        },
        {
          name: 'Mouse Inalámbrico Pro',
          description: 'Sensor óptico de 16000 DPI con batería de larga duración',
          price: 49.99,
          category: 'Periféricos',
          tags: ['gaming', 'mouse', 'inalámbrico'],
          inStock: true,
        },
        {
          name: 'Monitor UltraWide 34"',
          description: 'Resolución QHD 144Hz curvo para productividad y juegos',
          price: 499.99,
          category: 'Monitores',
          tags: ['pantalla', 'ultrawide', '144hz'],
          inStock: false,
        },
      ]);
      this.logger.log('Datos de prueba insertados en MySQL con éxito.');
    }
  }

  async findAll(filters: FilterProductDto) {
    // La lógica de QueryBuilder ahora reside dentro del ProductsRepository
    const [items, total] = await this.productsRepository.findAllWithFilters(filters);

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado en la base de datos MySQL`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = this.productsRepository.create({
      ...createProductDto,
      inStock: createProductDto.inStock ?? true,
    });
    return await this.productsRepository.save(newProduct);
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    const updated = this.productsRepository.merge(product, updateProductDto);
    return await this.productsRepository.save(updated);
  }

  async patch(id: number, patchProductDto: UpdateProductDto): Promise<Product> {
    return await this.update(id, patchProductDto);
  }

  async remove(id: number): Promise<{ deleted: boolean; message: string }> {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
    return {
      deleted: true,
      message: `Producto con ID ${id} eliminado con éxito de MySQL`,
    };
  }
}

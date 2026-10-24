import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Header,
} from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { FilterProductDto } from './dto/filter-product.dto.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * GET /products
   * Consulta TypeORM a MySQL con filtros (@Query), paginación y búsqueda.
   */
  @Get()
  @Header('X-Resource-Type', 'Products-List-TypeORM')
  async findAll(@Query() filters: FilterProductDto) {
    return await this.productsService.findAll(filters);
  }

  /**
   * GET /products/:id
   * Consulta TypeORM a MySQL por clave primaria (@Param con ParseIntPipe).
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.findOne(id);
  }

  /**
   * POST /products
   * Inserta un nuevo registro en la tabla 'products' de MySQL mediante TypeORM.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productsService.create(createProductDto);
    return {
      message: 'Producto creado exitosamente en MySQL (TypeORM)',
      product,
    };
  }

  /**
   * PUT /products/:id
   * Actualización completa en MySQL por su ID.
   */
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productsService.update(id, updateProductDto);
    return {
      message: `Producto con ID ${id} actualizado completamente en MySQL (PUT)`,
      product,
    };
  }

  /**
   * PATCH /products/:id
   * Actualización parcial en MySQL (solo los campos provistos).
   */
  @Patch(':id')
  async patch(
    @Param('id', ParseIntPipe) id: number,
    @Body() patchProductDto: UpdateProductDto,
  ) {
    const product = await this.productsService.patch(id, patchProductDto);
    return {
      message: `Producto con ID ${id} modificado parcialmente en MySQL (PATCH)`,
      product,
    };
  }

  /**
   * DELETE /products/:id
   * Elimina el registro correspondiente en MySQL.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.remove(id);
  }
}

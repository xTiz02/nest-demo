import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProductsModule } from './products/products.module.js';
import { FilesModule } from './files/files.module.js';
import { ExamplesModule } from './examples/examples.module.js';
import { Product } from './products/entities/product.entity.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'nest_db',
      entities: [Product],
      autoLoadEntities: true,
      synchronize: true, // Crea las tablas y sincroniza el esquema automáticamente en desarrollo
    }),
    ProductsModule,
    FilesModule,
    ExamplesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

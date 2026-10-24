import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  MinLength,
  IsOptional,
  IsArray,
  IsBoolean,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: 'El precio debe ser un número válido' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  price: number;

  @IsString()
  @IsNotEmpty({ message: 'La categoría es obligatoria' })
  category: string;

  @IsArray()
  @IsString({ each: true, message: 'Cada etiqueta debe ser un texto' })
  @IsOptional()
  tags?: string[];

  @IsBoolean()
  @IsOptional()
  inStock?: boolean = true;
}

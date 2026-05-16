import { Ruta } from '../types/ruta';
import {
  IsArray,
  ArrayMinSize,
  IsEnum,
  IsOptional,
  Matches,
  IsNotEmpty,
  IsString,
  ValidateNested,
  IsNumber,
  IsLongitude,
  IsLatitude,
  IsHexColor,
} from 'class-validator';

import { Type } from 'class-transformer';

class NodoDto {
  //   Datos:
  // - lat: number
  // - lng: number

  @IsNumber({}, { message: 'La latitud debe ser un número válido.' })
  @IsNotEmpty({ message: 'La latitud es obligatoria en cada punto de la ruta.' })
  @IsLatitude({ message: 'La latitud debe estar entre -90 y 90.' })
  lat?: number;

  @IsNumber({}, { message: 'La longitud debe ser un número válido.' })
  @IsNotEmpty({
    message: 'La longitud es obligatoria en cada punto de la ruta.',
  })
  @IsLongitude({ message: 'La longitud debe estar entre -180 y 180.' })
  lng?: number;
}

// DTO para crear un cliente
export class CreateRutaDTO {
  // Datos:
  // - nombre_ruta: string
  // - destino: string
  // - descripcion?: string
  // - nombre_empresa: string
  // - id_empresa: string | se obtiene buscando el id de la empresa por su nombre, esto se hace en el servicio
  // - coordenadas: NodoDto[]
  // - colorhex: string
  // - estado?: string

  @IsString({
    message: 'El nombre de la ruta debe ser texto.',
  })
  @IsNotEmpty({ message: 'El nombre de la ruta es obligatorio.' })
  @Matches(/^(?!\s*$).+/, {
    message: 'El nombre de la ruta no puede ser solo espacios.',
  })
  @Matches(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\.]+$/, {
    message:
      'El nombre solo puede incluir letras, números, espacios y puntos.',
  })
  nombre_ruta!: string;

  @IsString({ message: 'El destino debe ser texto.' })
  @IsNotEmpty({ message: 'El destino es obligatorio.' })
  @Matches(/^(?!\s*$).+/, {
    message: 'El destino no puede ser solo espacios.',
  })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, {
    message: 'El destino solo puede incluir letras y espacios.',
  })
  destino!: string;

  @IsOptional() // Permite que el campo sea opcional al crear un ruta
  @IsString({
    message: 'La descripción debe ser texto.',
  })
  @Matches(/^(?!\s*$).+/, {
    message: 'La descripción no puede ser solo espacios.',
  })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, {
    message: 'La descripción solo puede incluir letras y espacios.',
  })
  descripcion?: string;

  @IsNotEmpty({ message: 'El nombre de la empresa es obligatorio.' })
  @IsString({ message: 'El nombre de la empresa debe ser texto.' })
  @Matches(/^(?!\s*$).+/, {
    message: 'El nombre de la empresa no puede ser solo espacios.',
  })
  @Matches(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\.]+$/, {
    message:
      'El nombre de la empresa solo puede incluir letras, números, espacios y puntos.',
  }) // Validación para permitir solo letras, números, espacios y puntos
  nombre_empresa!: string;

  //posible solucion
  @IsOptional() // Permite que el campo sea opcional al crear un ruta
  @IsString({ message: 'El ID de la empresa debe ser texto.' })
  @IsNotEmpty({ message: 'El ID de la empresa es obligatorio.' })
  @Matches(/^(?!\s*$).+/, {
    message: 'El ID de la empresa no puede ser solo espacios.',
  })
  id_empresa!: string; // Usamos ID en el DTO, el nombre se obtiene con un Join después

  @IsArray()
  @ArrayMinSize(2, {
    message:
      'Agrega al menos dos puntos en el mapa (inicio y fin del recorrido).',
  })
  // Validamos que sea un array de arrays de números: [[lng, lat], [lng, lat]]
  //transformr al formato geojson en el services
  @ValidateNested({ each: true })
  @Type(() => NodoDto)
  coordenadas!: NodoDto[];

  @IsHexColor({
    message:
      'El color debe ser un código hexadecimal válido (por ejemplo #2563EB).',
  })
  colorhex!: string;

  @IsOptional() // Permite que el campo sea opcional al crear un ruta
  @Matches(/^(?!\s*$).+/, {
    message: 'El estado no puede ser solo espacios.',
  })
  @IsEnum(['Activa', 'Inactiva'], {
    message: 'El estado debe ser Activa o Inactiva.',
  })
  estado?: string;
}

// DTO para actualizar un ruta
export class UpdateRutaDTO {
  //   Datos:
  // - nombre_ruta?: string
  // - destino?: string
  // - descripcion?: string
  // - nombre_empresa?: string
  // - id_empresa?: string
  // - coordenadas?: NodoDto[]
  // - colorhex?: string
  // - estado?: string

  @IsOptional()
  @IsString()
  @Matches(/^(?!\s*$).+/, {
    message: 'El nombre de la ruta no puede ser solo espacios.',
  })
  @Matches(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\.]+$/, {
    message:
      'El nombre solo puede incluir letras, números, espacios y puntos.',
  })
  nombre_ruta?: string;

  @IsOptional() // Permite que el campo sea opcional al actualizar un ruta
  @IsString()
  @Matches(/^(?!\s*$).+/, {
    message: 'El destino no puede ser solo espacios.',
  })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, {
    message: 'El destino solo puede incluir letras y espacios.',
  })
  destino?: string;

  @IsOptional() // Permite que el campo sea opcional al actualizar un ruta
  @IsString({ message: 'El nombre de la empresa debe ser texto.' })
  @Matches(/^(?!\s*$).+/, {
    message: 'El nombre de la empresa no puede ser solo espacios.',
  })
  @Matches(/^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s\.]+$/, {
    message:
      'El nombre de la empresa solo puede incluir letras, números, espacios y puntos.',
  }) // Validación para permitir solo letras, números, espacios y puntos
  nombre_empresa?: string;

  @IsOptional() // Permite que el campo sea opcional al actualizar un ruta
  @IsString({})
  @Matches(/^(?!\s*$).+/, {
    message: 'El ID de la empresa no puede ser solo espacios.',
  })
  id_empresa?: string;

  @IsOptional()
  @Matches(/^(?!\s*$).+/, {
    message: 'Los puntos del recorrido no pueden ser solo espacios.',
  })
  @IsArray()
  @ArrayMinSize(2, {
    message:
      'Agrega al menos dos puntos en el mapa (inicio y fin del recorrido).',
  })
  // Validamos que sea un array de arrays de números: [[lng, lat], [lng, lat]]
  //transformr al formato geojson en el services
  @ValidateNested({ each: true })
  @Type(() => NodoDto)
  coordenadas!: NodoDto[];

  @IsHexColor({
    message:
      'El color debe ser un código hexadecimal válido (por ejemplo #2563EB).',
  })
  colorhex!: string;

  @IsOptional() // Permite que el campo sea opcional al actualizar un ruta
  @Matches(/^(?!\s*$).+/, {
    message: 'El estado no puede ser solo espacios.',
  })
  @IsEnum(['Activa', 'Inactiva'], {
    message: 'El estado debe ser Activa o Inactiva.',
  })
  estado?: string;
}

// DTO para respuesta de la ruta. Incluye el nombre de la empresa a través de un join en el modelo
export class RutaResponseDTO {
  nombre?: string;
  destino?: string;
  descripcion?: string;
  nombre_empresa?: string;
  coordenadas?: { type: 'LineString'; coordinates: [number, number][] };
  colorhex?: string;
  estado?: string;

  constructor(ruta: Ruta) {
    this.nombre = ruta.nombre_ruta;
    this.destino = ruta.destino;
    this.descripcion = ruta.descripcion;
    this.nombre_empresa = ruta.empresa?.nombre_empresa || ''; // Asignamos el nombre de la empresa desde la relación
    this.colorhex = ruta.colorhex;
    this.estado = ruta.estado;
    this.coordenadas = ruta.coordenadas;
  }
}

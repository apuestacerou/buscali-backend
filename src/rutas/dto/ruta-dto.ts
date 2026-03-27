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
  @IsNumber({}, { message: 'Latitud debe ser numérica' })
  @IsNotEmpty()
  @IsLatitude()
  lat!: number;

  @IsNumber({}, { message: 'Longitud debe ser numérica' })
  @IsNotEmpty()
  @IsLongitude()
  lng!: number;
}

// DTO para crear un cliente
export class CreateRutaDTO {
  @IsString()
  @IsNotEmpty({ message: 'El ID de la ruta no puede estar vacío' })
  @Matches(/^(?!\s*$).+/, {
    message: 'El ID de la ruta no puede ser solo espacios',
  })
  id_ruta!: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre de la ruta no puede estar vacío' })
  @Matches(/^(?!\s*$).+/, {
    message: 'El nombre de la ruta no puede ser solo espacios',
  })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, {
    message: 'El nombre de la ruta solo puede contener letras y espacios',
  })
  nombre_ruta!: string;

  @IsString()
  @IsNotEmpty({ message: 'El destino de la ruta no puede estar vacío' })
  @Matches(/^(?!\s*$).+/, {
    message: 'El destino de la ruta no puede ser solo espacios',
  })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, {
    message: 'El destino de la ruta solo puede contener letras y espacios',
  })
  destino!: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción de la ruta no puede estar vacío' })
  @Matches(/^(?!\s*$).+/, {
    message: 'La descripción de la ruta no puede ser solo espacios',
  })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, {
    message: 'La descripción de la ruta solo puede contener letras y espacios',
  })
  descripcion?: string;

  // @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, {
  //   message: 'El nombre de la empresa solo puede contener letras y espacios',
  // }) // Validación para permitir solo letras y espacios
  // nombre_empresa!: string;

  //posible solucion
  @IsString({})
  @IsNotEmpty({ message: 'El ID de la empresa no puede estar vacío' })
  @Matches(/^(?!\s*$).+/, {
    message: 'El ID de la Empresa no puede ser solo espacios',
  })
  id_empresa!: string; // Usamos ID en el DTO, el nombre se obtiene con un Join después

  // (?) permite enviar o no el estado al crear un ruta, si no se envía se asume que es "Activo" por defecto en la base de datos, pero si se envía debe ser "Activo" o "Inactivo"

  // @Matches(/^(?!\s*$).+/, {
  //   message: 'Los nodos de la ruta no pueden ser solo espacios',
  // })
  @IsArray()
  @ArrayMinSize(2, {
    message: 'Una ruta debe tener al menos 2 puntos/nodos (inicio y fin)',
  })
  // Validamos que sea un array de arrays de números: [[lng, lat], [lng, lat]]
  //transformr al formato geojson en el services
  @ValidateNested({ each: true })
  @Type(() => NodoDto)
  coordenadas!: NodoDto[];

  @IsOptional() // Permite que el campo sea opcional al crear un ruta
  @IsEnum(['Activa', 'Inactiva'], {
    message:
      'Estado debe ser "Activa" o "Inactiva", con la primera letra en mayúscula',
  })
  estado?: string;
}

// DTO para actualizar un ruta
export class UpdateRutaDTO {
  @IsOptional()
  @IsString()
  @Matches(/^(?!\s*$).+/, {
    message: 'El nombre de la ruta no puede ser solo espacios',
  })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, {
    message: 'El nombre de la ruta solo puede contener letras y espacios',
  })
  nombre_ruta!: string;

  @IsOptional() // Permite que el campo sea opcional al actualizar un ruta
  @IsString()
  @Matches(/^(?!\s*$).+/, {
    message: 'El destino de la ruta no puede ser solo espacios',
  })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, {
    message: 'El destino de la ruta solo puede contener letras y espacios',
  })
  destino!: string;

  @IsOptional() // Permite que el campo sea opcional al actualizar un ruta
  @IsString({})
  @Matches(/^(?!\s*$).+/, {
    message: 'El ID de la Empresa no puede ser solo espacios',
  })
  id_empresa!: string;

  @IsOptional()
  @Matches(/^(?!\s*$).+/, {
    message: 'Los nodos de la ruta no pueden ser solo espacios',
  })
  @IsArray()
  @ArrayMinSize(2, {
    message: 'Una ruta debe tener al menos 2 puntos/nodos (inicio y fin)',
  })
  // Validamos que sea un array de arrays de números: [[lng, lat], [lng, lat]]
  coordenadas?: [number, number][];

  @IsOptional() // Permite que el campo sea opcional al actualizar un ruta
  @Matches(/^(?!\s*$).+/, {
    message: 'El Estado de la ruta no puede ser solo espacios',
  })
  @IsEnum(['Activa', 'Inactiva'], {
    message:
      'Estado debe ser "Activa" o "Inactiva", con la primera letra en mayúscula',
  })
  estado!: string;

  @IsHexColor()
  colorHex!: string;
}

// DTO para respuesta al ruta
//TODO: conseguir el nombre de la empresa
export class RutaResponseDTO {
  nombre?: string;
  destino?: string;
  nombre_empresa?: string;
  coordenadas: { type: 'LineString'; coordinates: [number, number][] };
  estado?: string;

  constructor(ruta: Ruta) {
    this.nombre = ruta.nombre_ruta;
    this.destino = ruta.destino;
    this.coordenadas = ruta.coordenadas;
    // this.nombre_empresa = ruta.nombre_empresa;
    this.estado = ruta.estado;
  }
}

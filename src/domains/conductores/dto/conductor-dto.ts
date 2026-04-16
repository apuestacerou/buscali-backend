import { Conductor } from '../types/conductor'
import { IsEmail, IsEnum, IsOptional, Matches} from 'class-validator';

// DTO para crear un cliente
export class CreateConductorDTO {
//TODO: No permitir que se envie la fecha_creacion. Se debe generar automáticamente en la base de datos, no debe ser parte del DTO de creación.

  @Matches(/^[0-9]{1,20}$/, { message: 'La Cedula debe contener solo Números y un máximo de 20 dígitos' }) // Validación para permitir solo dígitos en la cédula
  cedula!: string;

  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, { message: 'Nombre solo puede contener letras y espacios' }) // Validación para permitir solo letras y espacios
  nombre!: string;

  @IsEmail({},{ message: 'Formato de correo electrónico inválido' }) // Validación para formato de correo electrónico
  correo_electronico!: string;

  @Matches(/^\+?[0-9]{7,15}$/, { message: 'Telefono debe contener solo Números y entre 7 y 15 dígitos' }) // Validación para permitir solo dígitos en el teléfono
  telefono!: string;

  @IsOptional() // Permite que el campo sea opcional al crear un conductor
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/, { message: "La contraseña debe tener entre 8 y 50 caracteres, incluir mayúscula, minúscula, número y símbolo" }) // Validación para contraseñas seguras
  contrasena?: string;

  @IsOptional() // Permite que el campo sea opcional al crear un conductor
  @IsEnum(['Activo', 'Inactivo'], { message: 'Estado debe ser "Activo" o "Inactivo", con la primera letra en mayúscula' })
  estado?: string;
}

// DTO para actualizar un conductor
export class UpdateConductorDTO {

  @IsOptional() // Permite que el campo sea opcional al actualizar un conductor
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, { message: 'Nombre solo puede contener letras y espacios' }) // Validación para permitir solo letras y espacios
  nombre?: string;

  @IsOptional() // Permite que el campo sea opcional al actualizar un conductor
  @IsEmail({},{ message: 'Formato de correo electrónico inválido' }) // Validación para formato de correo electrónico
  correo_electronico?: string;

  @IsOptional() // Permite que el campo sea opcional al actualizar un conductor
  @Matches(/^\+?[0-9]{7,15}$/, { message: 'Telefono debe contener solo Números y entre 7 y 15 dígitos' }) // Validación para permitir solo dígitos en el teléfono
  telefono?: string;
  
  @IsOptional() // Permite que el campo sea opcional al actualizar un conductor
  @IsEnum(['Activo', 'Inactivo'], { message: 'Estado debe ser "Activo" o "Inactivo"' })
  estado?: string;
  
}

// DTO para respuesta al conductor
export class ConductorResponseDTO {
  cedula?: string;
  nombre?: string;
  correo_electronico?: string;
  telefono?: string;
  estado?: string;

  constructor(conductor: Conductor) {
    this.nombre = conductor.nombre;
    this.correo_electronico = conductor.correo_electronico;
    this.telefono = conductor.telefono;
    this.cedula = conductor.cedula;
    this.estado = conductor.estado;
  }
}

//DTO para login
export class ConductorLoginDTO {
  @Matches(/^\+?[0-9]{7,15}$/, { message: 'Telefono debe contener solo Números y entre 7 y 15 dígitos' }) // Validación para permitir solo dígitos en el teléfono
  telefono!: string
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/, { message: "La contraseña debe tener entre 8 y 50 caracteres, incluir mayúscula, minúscula, número y símbolo" }) // Validación para contraseñas seguras
  contrasena!: string
}
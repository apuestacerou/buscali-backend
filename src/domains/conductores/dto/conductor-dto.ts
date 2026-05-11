import { Conductor } from '../types/conductor';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  Matches,
  IsBoolean,
} from 'class-validator';

// DTO para crear un cliente
export class CreateConductorDTO {
  @IsNotEmpty({ message: 'La Cedula no puede estar vacía' })
  @Matches(/^[0-9]{1,20}$/, {
    message: 'La Cedula debe contener solo Números y un máximo de 20 dígitos',
  }) // Validación para permitir solo dígitos en la cédula
  cedula!: string;

  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @Matches(/\S/, { message: 'El nombre no puede ser solo espacios' })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, {
    message: 'Nombre solo puede contener letras y espacios',
  }) // Validación para permitir solo letras y espacios
  nombre!: string;

  @IsNotEmpty({ message: 'El correo no puede estar vacío' })
  @IsEmail({}, { message: 'Formato de correo electrónico inválido' }) // Validación para formato de correo electrónico
  correo_electronico!: string;

  @IsNotEmpty({ message: 'El Teléfono no puede estar vacío' })
  @Matches(/^\+?[0-9]{7,15}$/, {
    message: 'Teléfono debe contener solo Números y entre 7 y 15 dígitos',
  }) // Validación para permitir solo dígitos en el teléfono
  telefono!: string;

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/,
    {
      message:
        'La contraseña debe tener entre 8 y 50 caracteres, incluir mayúscula, minúscula, número y símbolo',
    },
  ) // Validación para contraseñas seguras
  contrasena!: string;

  @IsBoolean({ message: 'Debe aceptar los términos y condiciones' })
  aceptaTerminos!: boolean;

  @IsOptional() // Permite que el campo sea opcional al crear un conductor
  @IsEnum(['Activo', 'Inactivo'], {
    message:
      'Estado debe ser "Activo" o "Inactivo", con la primera letra en mayúscula',
  })
  estado?: string;
}

// DTO para actualizar un conductor
export class UpdateConductorDTO {
  @IsOptional() // Permite que el campo sea opcional al actualizar un conductor
  @Matches(/\S/, { message: 'El nombre no puede ser solo espacios' })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, {
    message: 'Nombre solo puede contener letras y espacios',
  }) // Validación para permitir solo letras y espacios
  nombre?: string;

  @IsOptional() // Permite que el campo sea opcional al actualizar un conductor
  @IsEmail({}, { message: 'Formato de correo electrónico inválido' }) // Validación para formato de correo electrónico
  correo_electronico?: string;

  @IsOptional() // Permite que el campo sea opcional al actualizar un conductor
  @Matches(/^\+?[0-9]{7,15}$/, {
    message: 'Telefono debe contener solo Números y entre 7 y 15 dígitos',
  }) // Validación para permitir solo dígitos en el teléfono
  telefono?: string;

  @IsOptional() // Permite que el campo sea opcional al actualizar un conductor
  @IsEnum(['Activo', 'Inactivo'], {
    message: 'Estado debe ser "Activo" o "Inactivo"',
  })
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
  @IsOptional()
  @IsEmail({}, { message: 'Formato de correo electrónico inválido' })
  correo_electronico?: string;

  @IsOptional()
  @Matches(/^\+?[0-9]{7,15}$/, {
    message: 'Telefono debe contener solo Números y entre 7 y 15 dígitos',
  })
  telefono?: string;

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/,
    {
      message:
        'La contraseña debe tener entre 8 y 50 caracteres, incluir mayúscula, minúscula, número y símbolo',
    },
  )
  contrasena!: string;
}

//DTO para forgot password
export class ForgotPasswordDTO {
  @IsEmail({}, { message: 'Formato de correo electrónico inválido' })
  correo_electronico!: string;
}

//DTO para reset password
export class ResetPasswordDTO {
  @Matches(/^[A-Za-z0-9]{32}$/, { message: 'Token inválido' }) // Asumiendo token de 32 caracteres
  token!: string;
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/,
    {
      message:
        'La contraseña debe tener entre 8 y 50 caracteres, incluir mayúscula, minúscula, número y símbolo',
    },
  )
  nueva_contrasena!: string;
}

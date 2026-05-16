import { Conductor } from '../types/conductor';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  Matches,
  IsBoolean,
  ValidateIf,
} from 'class-validator';

function validateWhenProvided(_object: object, value: unknown): boolean {
  return value != null && String(value).trim() !== '';
}

// DTO para crear un cliente
export class CreateConductorDTO {
  @IsNotEmpty({ message: 'La cédula es obligatoria.' })
  @Matches(/^[0-9]{1,20}$/, {
    message: 'La cédula solo puede contener números (hasta 20 dígitos).',
  })
  cedula!: string;

  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @Matches(/\S/, { message: 'El nombre no puede ser solo espacios.' })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, {
    message: 'El nombre solo puede incluir letras y espacios.',
  })
  nombre!: string;

  @IsNotEmpty({ message: 'El correo es obligatorio.' })
  @IsEmail({}, { message: 'Ingresa un correo electrónico válido.' })
  correo_electronico!: string;

  @IsNotEmpty({ message: 'El teléfono es obligatorio.' })
  @Matches(/^\+?[0-9]{7,15}$/, {
    message:
      'El teléfono solo puede incluir números (entre 7 y 15 dígitos). Puedes anteponer +.',
  })
  telefono!: string;

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/,
    {
      message:
        'La contraseña debe tener entre 8 y 50 caracteres e incluir mayúscula, minúscula, número y un símbolo (@, $, !, %, *, ?, &).',
    },
  )
  contrasena!: string;

  @IsBoolean({
    message: 'Para registrarte debes aceptar los términos y condiciones.',
  })
  aceptaTerminos!: boolean;

  @IsOptional()
  @IsEnum(['Activo', 'Inactivo'], {
    message: 'El estado debe ser Activo o Inactivo.',
  })
  estado?: string;
}

// DTO para actualizar un conductor
export class UpdateConductorDTO {
  @IsOptional()
  @ValidateIf(validateWhenProvided)
  @Matches(/\S/, { message: 'El nombre no puede ser solo espacios.' })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, {
    message: 'El nombre solo puede incluir letras y espacios.',
  })
  nombre?: string;

  @IsOptional()
  @ValidateIf(validateWhenProvided)
  @IsEmail({}, { message: 'Ingresa un correo electrónico válido.' })
  correo_electronico?: string;

  @IsOptional()
  @ValidateIf(validateWhenProvided)
  @Matches(/^\+?[0-9]{7,15}$/, {
    message:
      'El teléfono solo puede incluir números (entre 7 y 15 dígitos). Puedes anteponer +.',
  })
  telefono?: string;

  @IsOptional()
  @ValidateIf(validateWhenProvided)
  @IsEnum(['Activo', 'Inactivo'], {
    message: 'El estado debe ser Activo o Inactivo.',
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
  @IsEmail({}, { message: 'Ingresa un correo electrónico válido.' })
  correo_electronico?: string;

  @IsOptional()
  @Matches(/^\+?[0-9]{7,15}$/, {
    message:
      'El teléfono solo puede incluir números (entre 7 y 15 dígitos). Puedes anteponer +.',
  })
  telefono?: string;

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/,
    {
      message:
        'La contraseña debe tener entre 8 y 50 caracteres e incluir mayúscula, minúscula, número y un símbolo (@, $, !, %, *, ?, &).',
    },
  )
  contrasena!: string;
}

//DTO para forgot password
export class ForgotPasswordDTO {
  @IsEmail({}, { message: 'Ingresa un correo electrónico válido.' })
  correo_electronico!: string;
}

//DTO para reset password
export class ResetPasswordDTO {
  @Matches(/^[A-Za-z0-9]{32}$/, {
    message: 'El enlace de recuperación no es válido.',
  })
  token!: string;
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/,
    {
      message:
        'La nueva contraseña debe tener entre 8 y 50 caracteres e incluir mayúscula, minúscula, número y un símbolo (@, $, !, %, *, ?, &).',
    },
  )
  nueva_contrasena!: string;
}

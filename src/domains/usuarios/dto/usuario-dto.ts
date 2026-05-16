import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { Usuario } from '../types/usuario';

export class CreateUsuarioDTO {
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,60}$/, {
    message: 'El nombre solo puede incluir letras y espacios.',
  })
  nombre!: string;

  @IsNotEmpty({ message: 'El apellido es obligatorio.' })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,60}$/, {
    message: 'El apellido solo puede incluir letras y espacios.',
  })
  apellido!: string;

  @IsEmail({}, { message: 'Ingresa un correo electrónico válido.' })
  correo!: string;

  @IsOptional()
  @Matches(/^\+?[0-9]{7,15}$/, {
    message:
      'El teléfono solo puede incluir números (entre 7 y 15 dígitos). Puedes anteponer +.',
  })
  telefono?: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  @Matches(/^(?=.*[A-Z])(?=.*[0-9]).{8,50}$/, {
    message:
      'La contraseña debe tener entre 8 y 50 caracteres e incluir al menos una mayúscula y un número.',
  })
  password!: string;

  @IsBoolean({
    message: 'Para registrarte debes aceptar los términos y condiciones.',
  })
  aceptaTerminos!: boolean;
}

export class UpdateUsuarioDTO {
  @IsOptional()
  @IsNotEmpty({ message: 'El nombre no puede quedar vacío.' })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,60}$/, {
    message: 'El nombre solo puede incluir letras y espacios.',
  })
  nombre?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'El apellido no puede quedar vacío.' })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,60}$/, {
    message: 'El apellido solo puede incluir letras y espacios.',
  })
  apellido?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Ingresa un correo electrónico válido.' })
  correo?: string;

  @IsOptional()
  @Matches(/^\+?[0-9]{7,15}$/, {
    message:
      'El teléfono solo puede incluir números (entre 7 y 15 dígitos). Puedes anteponer +.',
  })
  telefono?: string;
}

export class UsuarioResponseDTO {
  id_usuario?: number;
  nombre?: string;
  apellido?: string;
  correo?: string;
  telefono?: string;
  fecha_registro?: Date;

  constructor(usuario: Usuario) {
    this.id_usuario = usuario.id_usuario;
    this.nombre = usuario.nombre;
    this.apellido = usuario.apellido;
    this.correo = usuario.correo;
    this.telefono = usuario.telefono || undefined;
    this.fecha_registro = usuario.fecha_registro;
  }
}

export class UsuarioLoginDTO {
  @IsOptional()
  @IsEmail({}, { message: 'Ingresa un correo electrónico válido.' })
  correo?: string;

  @IsOptional()
  @Matches(/^\+?[0-9]{7,15}$/, {
    message:
      'El teléfono solo puede incluir números (entre 7 y 15 dígitos). Puedes anteponer +.',
  })
  telefono?: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  @Matches(/^(?=.*[A-Z])(?=.*[0-9]).{8,50}$/, {
    message:
      'La contraseña debe tener entre 8 y 50 caracteres e incluir al menos una mayúscula y un número.',
  })
  password!: string;
}

export class ForgotPasswordDTO {
  @IsEmail({}, { message: 'Ingresa un correo electrónico válido.' })
  correo!: string;
}

export class ResetPasswordDTO {
  @Matches(/^[A-Fa-f0-9]{32}$/, {
    message: 'El enlace de recuperación no es válido.',
  })
  token!: string;

  @IsNotEmpty({ message: 'La nueva contraseña es obligatoria.' })
  @Matches(/^(?=.*[A-Z])(?=.*[0-9]).{8,50}$/, {
    message:
      'La nueva contraseña debe tener entre 8 y 50 caracteres e incluir al menos una mayúscula y un número.',
  })
  nueva_password!: string;
}

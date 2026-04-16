import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { Usuario } from '../types/usuario';

export class CreateUsuarioDTO {
  @IsNotEmpty({ message: 'Nombre es requerido' })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,60}$/, {
    message: 'Nombre solo puede contener letras y espacios',
  })
  nombre!: string;

  @IsNotEmpty({ message: 'Apellido es requerido' })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,60}$/, {
    message: 'Apellido solo puede contener letras y espacios',
  })
  apellido!: string;

  @IsEmail({}, { message: 'Formato de correo electrónico inválido' })
  correo!: string;

  @IsOptional()
  @Matches(/^\+?[0-9]{7,15}$/, {
    message: 'Telefono debe contener solo Números y entre 7 y 15 dígitos',
  })
  telefono?: string;

  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/, {
    message:
      'La contraseña debe tener entre 8 y 50 caracteres, incluir mayúscula, minúscula, número y símbolo',
  })
  password!: string;

  @IsBoolean({ message: 'Debe aceptar los términos y condiciones' })
  aceptaTerminos!: boolean;
}

export class UpdateUsuarioDTO {
  @IsOptional()
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,60}$/, {
    message: 'Nombre solo puede contener letras y espacios',
  })
  nombre?: string;

  @IsOptional()
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,60}$/, {
    message: 'Apellido solo puede contener letras y espacios',
  })
  apellido?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Formato de correo electrónico inválido' })
  correo?: string;

  @IsOptional()
  @Matches(/^\+?[0-9]{7,15}$/, {
    message: 'Telefono debe contener solo Números y entre 7 y 15 dígitos',
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
  @IsEmail({}, { message: 'Formato de correo electrónico inválido' })
  correo?: string;

  @IsOptional()
  @Matches(/^\+?[0-9]{7,15}$/, {
    message: 'Telefono debe contener solo Números y entre 7 y 15 dígitos',
  })
  telefono?: string;

  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/, {
    message:
      'La contraseña debe tener entre 8 y 50 caracteres, incluir mayúscula, minúscula, número y símbolo',
  })
  password!: string;
}

export class ForgotPasswordDTO {
  @IsEmail({}, { message: 'Formato de correo electrónico inválido' })
  correo!: string;
}

export class ResetPasswordDTO {
  @Matches(/^[A-Fa-f0-9]{32}$/, { message: 'Token inválido' })
  token!: string;

  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/, {
    message:
      'La contraseña debe tener entre 8 y 50 caracteres, incluir mayúscula, minúscula, número y símbolo',
  })
  nueva_password!: string;
}

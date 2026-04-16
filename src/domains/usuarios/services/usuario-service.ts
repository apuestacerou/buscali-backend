import { UsuarioRepository } from '../repositories/usuario-repository';
import { Usuario } from '../types/usuario';
import {
  CreateUsuarioDTO,
  UsuarioResponseDTO,
  UsuarioLoginDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
} from '../dto/usuario-dto';
import {
  ConflictError,
  ValidationError,
} from '../../../shared/errors/error.class';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export class UsuarioService {
  private repo = new UsuarioRepository();

  /**
   * Crea un nuevo usuario en el sistema.
   * Valida que el correo y teléfono no estén duplicados, y que se acepten los términos.
   * Hashea la contraseña antes de guardar.
   */
  async create(dto: CreateUsuarioDTO): Promise<UsuarioResponseDTO> {
    const errors: string[] = [];

    // Verificar si el correo ya existe
    const existingCorreo = await this.repo.findUsuarioByCorreo(dto.correo);
    if (existingCorreo) {
      errors.push('Usuario con este correo ya existe');
    }

    // Verificar si el teléfono ya existe (si se proporciona)
    if (dto.telefono) {
      const existingTelefono = await this.repo.findUsuarioByTelefono(
        dto.telefono,
      );
      if (existingTelefono) {
        errors.push('Usuario con este teléfono ya existe');
      }
    }

    // Validar aceptación de términos
    if (!dto.aceptaTerminos) {
      errors.push('Es obligatorio aceptar los términos y condiciones para registrarse');
    }

    if (errors.length > 0) {
      throw new ConflictError(errors);
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Crear el usuario en la base de datos
    const usuario = await this.repo.createUsuario({
      nombre: dto.nombre,
      apellido: dto.apellido,
      correo: dto.correo,
      telefono: dto.telefono,
      password: hashedPassword,
      reset_token: null,
      reset_expires: null,
    } as Omit<Usuario, 'id_usuario' | 'fecha_registro'>);

    return new UsuarioResponseDTO(usuario);
  }

  /**
   * Inicia sesión de un usuario.
   * Permite login por correo o teléfono.
   * Valida credenciales y genera un JWT token.
   */
  async login(dto: UsuarioLoginDTO): Promise<{ token: string }> {
    const errors: string[] = [];

    // Verificar que se proporcione al menos correo o teléfono
    if (!dto.correo && !dto.telefono) {
      errors.push('Debe proporcionar correo electrónico o teléfono');
    }

    let existingUsuario: Usuario | null = null;

    // Buscar usuario por correo
    if (dto.correo) {
      existingUsuario = await this.repo.findUsuarioByCorreo(dto.correo);
      if (!existingUsuario) {
        errors.push('Usuario con este correo electrónico no existe');
      }
    } else if (dto.telefono) {
      // Buscar usuario por teléfono
      existingUsuario = await this.repo.findUsuarioByTelefono(dto.telefono);
      if (!existingUsuario) {
        errors.push('Usuario con este teléfono no existe');
      }
    }

    // Verificar contraseña si el usuario existe
    if (existingUsuario) {
      const isValid = await bcrypt.compare(dto.password, existingUsuario.password);
      if (!isValid) {
        errors.push('Contraseña no válida');
      }
    }

    if (errors.length > 0) {
      throw new ValidationError(errors);
    }

    // Generar token JWT
    const payload = {
      sub: existingUsuario!.id_usuario,
    };

    const token = jwt.sign({ payload }, process.env.SECRET_JWT_KEY!, {
      expiresIn: '2h',
    });

    return { token };
  }

  /**
   * Inicia el proceso de recuperación de contraseña.
   * Genera un token único y lo envía por email al usuario.
   * El token expira en 15 minutos.
   */
  async forgotPassword(dto: ForgotPasswordDTO): Promise<void> {
    const usuario = await this.repo.findUsuarioByCorreo(dto.correo);
    if (!usuario) {
      throw new ValidationError('Correo electrónico no registrado');
    }

    // Generar token de recuperación (32 caracteres hex)
    const token = crypto.randomBytes(16).toString('hex');
    // Token expira en 15 minutos
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    // Guardar token en la base de datos
    await this.repo.setResetToken(dto.correo, token, expires);

    // Configurar transporte de email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Enviar email con enlace de recuperación
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: dto.correo,
      subject: 'Recuperación de contraseña',
      text: `Usa este enlace para restablecer tu contraseña: ${process.env.FRONTEND_URL}/reset-password?token=${token}`,
    });
  }

  /**
   * Restablece la contraseña de un usuario usando un token válido.
   * El token debe no estar expirado.
   */
  async resetPassword(dto: ResetPasswordDTO): Promise<void> {
    // Hashear la nueva contraseña y actualizar en la base de datos
    const usuario = await this.repo.resetPassword(
      dto.token,
      await bcrypt.hash(dto.nueva_password, 10),
    );
    if (!usuario) {
      throw new ValidationError('Token inválido o expirado');
    }
  }
}

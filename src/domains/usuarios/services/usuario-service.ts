import { UsuarioRepository } from '../repositories/usuario-repository';
import { Usuario } from '../types/usuario';
import {
  CreateUsuarioDTO,
  UsuarioResponseDTO,
  UsuarioLoginDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
  UpdateUsuarioDTO,
} from '../dto/usuario-dto';
import {
  ConflictError,
  ValidationError,
} from '../../../shared/errors/error.class';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export class UsuarioService {
  private repo = new UsuarioRepository();

  /**
   * Crea un nuevo usuario en el sistema.
   * Valida que el correo y teléfono no estén duplicados, y que se acepten los términos.
   * Hashea la contraseña antes de guardar.
   */
  async list(): Promise<UsuarioResponseDTO[]> {
    const usuarios: Usuario[] = await this.repo.findAllUsuarios();
    //verifica si hay conductores, si no hay lanza un error
    if (usuarios.length === 0) {
      throw new ValidationError('Conductores no encontrados');
    }
    return usuarios.map((c) => new UsuarioResponseDTO(c));
  }

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
      errors.push(
        'Es obligatorio aceptar los términos y condiciones para registrarse',
      );
    }

    if (errors.length > 0) {
      throw new ConflictError(errors);
    }

    // Hashear la contraseña con 12 rounds de salt
    const hashedPassword = await bcrypt.hash(dto.password, 12);

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
      const isValid = await bcrypt.compare(
        dto.password,
        existingUsuario.password,
      );
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
      expiresIn: '3h',
    });

    return { token };
  }

  /**
   * Inicia el proceso de recuperación de contraseña.
   * Genera un token único y lo envía por email al usuario.
   * El token expira en 15 minutos.
   */
  async forgotPassword(dto: ForgotPasswordDTO): Promise<{ message: string }> {
    const usuario = await this.repo.findUsuarioByCorreo(dto.correo);
    if (!usuario) {
      throw new ValidationError('Correo electrónico no registrado');
    }

    // Generar token de recuperación (32 caracteres hex)
    const token = crypto.randomBytes(16).toString('hex');
    // Token expira en 30 minutos
    const expires = new Date(Date.now() + 30 * 60 * 1000);

    // Guardar token en la base de datos
    await this.repo.setResetToken(dto.correo, token, expires);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const recoveryLink = `${frontendUrl}/reset-password?token=${token}`;

    console.log('Enlace de recuperación generado:', recoveryLink);

    return {
      message: 'Token generado correctamente (revisar consola)',
    };
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

  async get(id: number): Promise<UsuarioResponseDTO | null> {
    const usuario: Usuario | null = await this.repo.findUsuarioById(id);
    //verifica si el usuario existe, si no existe lanza un error
    if (!usuario) {
      throw new ValidationError('Usuario no encontrado');
    }
    return usuario ? new UsuarioResponseDTO(usuario) : null;
  }

  async update(
    id: number,
    dto: UpdateUsuarioDTO,
  ): Promise<UsuarioResponseDTO | null> {
    const errors: string[] = [];
    //valida que no exista un conductor con el mismo correo_electronico
    // const existing_correo_electronico =
    //   await this.repo.findUsuarioByCorreoElectronico(
    //     dto.correo_electronico || '',
    //   );
    // if (existing_correo_electronico) {
    //   errors.push('Conductor con este correo electronico ya existe');
    // }
    //valida que no exista un conductor con el mismo telefono
    const existing_telefono = await this.repo.findUsuarioByTelefono(
      dto.telefono || '',
    );
    if (existing_telefono) {
      errors.push('Conductor con este telefono ya existe');
    }
    if (errors.length > 0) {
      throw new ConflictError(errors);
    }

    //actualiza en la db y devuelve el conductor
    const usuario: Usuario | null = await this.repo.findUsuarioById(id);
    //verifica si el conductor existe, si no existe lanza un error
    if (!usuario) {
      throw new ValidationError('Usuario no encontrado');
    }

    const updated = await this.repo.updateUsuario(id, dto);
    return updated ? new UsuarioResponseDTO(updated) : null;
  }

  async delete(id: number): Promise<boolean> {
    const usuario: Usuario | null = await this.repo.findUsuarioById(id);
    //verifica si el conductor existe, si no existe lanza un error
    if (!usuario) {
      throw new ValidationError('Usuario no encontrado');
    }
    return await this.repo.deleteUsuario(id);
  }
}

import { Request, Response, NextFunction } from 'express';
import { UsuarioService } from '../services/usuario-service';
import {
  CreateUsuarioDTO,
  UpdateUsuarioDTO,
  UsuarioLoginDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
} from '../dto/usuario-dto';
import { plainToInstance } from 'class-transformer';
import { checkDto } from '../../../shared/utils/checkDTO';
import { sendSuccess } from '../../../shared/utils/sendSuccess';

const service = new UsuarioService();

/**
 * GET /api/usuarios - Listar todos los usuarios.
 * No devolvemos passwordHash por seguridad.
 */
export async function listUsuarios(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const usuarios = await service.list();
    return sendSuccess(res, 200, 'Usuarios listados correctamente', usuarios);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/usuarios/:id - Obtener un usuario por su ID.
 * Parámetro id viene en req.params.id (string); lo convertimos a número.
 */
export async function getUsuario(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = parseInt(req.params.id);
    const usuario = await service.get(id);
    return sendSuccess(res, 200, 'Usuario encontrado', usuario);
  } catch (error) {
    next(error);
  }
}

export async function createUsuario(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    console.log('Intentando registrar usuario:', req.body.correo);
    const dto: CreateUsuarioDTO = plainToInstance(
      CreateUsuarioDTO,
      req.body as Record<string, unknown>,
    );
    await checkDto(dto);

    const usuario = await service.create(dto);
    console.log('Usuario registrado exitosamente:', usuario.correo);
    return sendSuccess(res, 201, 'Usuario registrado correctamente', usuario);
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    next(error);
  }
}

export async function loginUsuario(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    console.log('Intentando login:', req.body.correo || req.body.telefono);
    const dto: UsuarioLoginDTO = plainToInstance(
      UsuarioLoginDTO,
      req.body as Record<string, unknown>,
    );
    await checkDto(dto);

    const login = await service.login(dto);
    res.cookie('access_token', login.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    console.log('Login exitoso');
    return sendSuccess(res, 200, 'Sesión iniciada correctamente');
  } catch (error) {
    console.error('Error en login:', error);
    next(error);
  }
}

export async function forgotPasswordUsuario(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    console.log('Recuperación de contraseña solicitada para:', req.body.correo);
    const dto: ForgotPasswordDTO = plainToInstance(
      ForgotPasswordDTO,
      req.body as Record<string, unknown>,
    );
    await checkDto(dto);
    await service.forgotPassword(dto);
    console.log('Email de recuperación enviado a:', req.body.correo);
    return sendSuccess(res, 200, 'Enlace de recuperación enviado al correo');
  } catch (error) {
    console.error('Error al enviar recuperación de contraseña:', error);
    next(error);
  }
}

export async function resetPasswordUsuario(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    console.log(
      'Intento de reseteo de contraseña con token:',
      req.body.token?.substring(0, 8) + '...',
    );
    const dto: ResetPasswordDTO = plainToInstance(
      ResetPasswordDTO,
      req.body as Record<string, unknown>,
    );
    await checkDto(dto);
    await service.resetPassword(dto);
    console.log('Contraseña restablecida exitosamente');
    return sendSuccess(res, 200, 'Contraseña restablecida correctamente');
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    next(error);
  }
}

/**
 * PUT /api/usuarios/:id - Actualizar un usuario existente.
 * Solo se actualizan los campos que vengan en el body (nombre, email, telefono, password, rol).
 */
export async function updateUsuario(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = parseInt(req.params.cedula);
    // transforma req.body(JSON) a UpdateUsuarioDTO y valida los datos usando class-validator
    const dto = plainToInstance(
      UpdateUsuarioDTO,
      req.body as Record<string, unknown>,
    );
    await checkDto(dto);
    const update = await service.update(id, dto);
    return sendSuccess(res, 200, 'Usuario actualizado correctamente', update);
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/usuarios/:id - Eliminar un usuario.
 * Respuesta 204 = éxito sin cuerpo en la respuesta.
 */
export async function deleteUsuario(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = parseInt(req.params.cedula);
    await service.delete(id);
    // 204 significa "No Content", no se devuelve body
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
}

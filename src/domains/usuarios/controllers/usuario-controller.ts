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

export async function createUsuario(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const dto: CreateUsuarioDTO = plainToInstance(
      CreateUsuarioDTO,
      req.body as Record<string, unknown>,
    );
    await checkDto(dto);

    const usuario = await service.create(dto);
    return sendSuccess(res, 201, 'Usuario registrado correctamente', usuario);
  } catch (error) {
    next(error);
  }
}

export async function loginUsuario(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
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
    return sendSuccess(res, 200, 'Sesión iniciada correctamente');
  } catch (error) {
    next(error);
  }
}

export async function forgotPasswordUsuario(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const dto: ForgotPasswordDTO = plainToInstance(
      ForgotPasswordDTO,
      req.body as Record<string, unknown>,
    );
    await checkDto(dto);
    await service.forgotPassword(dto);
    return sendSuccess(res, 200, 'Enlace de recuperación enviado al correo');
  } catch (error) {
    next(error);
  }
}

export async function resetPasswordUsuario(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const dto: ResetPasswordDTO = plainToInstance(
      ResetPasswordDTO,
      req.body as Record<string, unknown>,
    );
    await checkDto(dto);
    await service.resetPassword(dto);
    return sendSuccess(res, 200, 'Contraseña restablecida correctamente');
  } catch (error) {
    next(error);
  }
}

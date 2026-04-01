import { Request, Response, NextFunction } from 'express';
import { ConductorService } from '../services/conductor-service';
import {
  CreateConductorDTO,
  UpdateConductorDTO,
  ConductorLoginDTO,
} from '../dto/conductor-dto';
import { plainToInstance } from 'class-transformer';
import { checkDto } from '../../../shared/utils/checkDTO';
import { sendSuccess } from '../../../shared/utils/sendSuccess';

const service = new ConductorService();

// Listar todos los conductores
export async function listConductores(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const conductores = await service.list();
    return sendSuccess(
      res,
      200,
      'Conductores listados correctamente',
      conductores,
    );
  } catch (error) {
    next(error);
  }
}
// Obtener conductor por ID
export async function getConductor(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const cedula = req.params.cedula;
    const conductor = await service.get(cedula);
    return sendSuccess(res, 200, 'Conductor encontrado', conductor);
  } catch (error) {
    next(error);
  }
}
// Crear un nuevo conductor
export async function createConductor(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // transforma y valida en un solo paso utilizando el helper
    const dto: CreateConductorDTO = plainToInstance(
      CreateConductorDTO,
      req.body as Record<string, unknown>,
    );
    await checkDto(dto);

    const newConductor = await service.create(dto);
    return sendSuccess(
      res,
      201,
      'Conductor creado correctamente',
      newConductor,
    );
  } catch (error) {
    next(error);
  }
}
// Actualizar un conductor existente
export async function updateConductor(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const cedula = req.params.cedula;
    // transforma req.body(JSON) a UpdateConductorDTO y valida los datos usando class-validator
    const dto = plainToInstance(
      UpdateConductorDTO,
      req.body as Record<string, unknown>,
    );
    await checkDto(dto);
    const update = await service.update(cedula, dto);
    return sendSuccess(res, 200, 'Conductor actualizado correctamente', update);
  } catch (error) {
    next(error);
  }
}
// Eliminar un conductor
export async function deleteConductor(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const cedula = req.params.cedula;
    await service.delete(cedula);
    // 204 significa "No Content", no se devuelve body
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
}
// Login
export async function loginConductor(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // transforma y valida el DTO
    const dto: ConductorLoginDTO = plainToInstance(
      ConductorLoginDTO,
      req.body as Record<string, unknown>,
    );
    await checkDto(dto);
    // lógica de login
    const login = await service.login(dto);
    // seteo de cookie segura
    res.cookie('access_token', login.token, {
      httpOnly: true, // solo accesible desde el servidor
      secure: process.env.NODE_ENV === 'production', // solo por https en producción
      sameSite: 'strict', // solo desde el mismo dominio
      // maxAge: 1000 * 60 * 60 // opcional: 1 hora
    });
    return sendSuccess(res, 200, 'Sesión iniciada correctamente');
  } catch (error) {
    next(error);
  }
}
//logout
export async function logoutConductor(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // Borra la cookie que guarda el JWT
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // usa true si estás en HTTPS en producción
      sameSite: 'strict',
    });
    // Limpia el estado de autenticación en el request
    req.auth = null;
    return sendSuccess(res, 200, 'Sesión cerrada correctamente');
  } catch (error) {
    next(error);
  }
}
// //Recuperar Contraseña
// router.put('/recuperar_contraseña', async (req:Request, res:Response) =>{
// try {
//   const dto: ConductorLoginDTO = plainToInstance(ConductorLoginDTO, req.body as Record<string, unknown>);
//   await checkDto(dto)
//   const conductor = await service.login(dto);
//     res.status(200).json({'Contraseña':'Cambiada', conductor});
// } catch (error) {
//   if (error instanceof ConflictError)
//     { return res.status(409).json({ error: error.messages }); }
//     if (error instanceof ValidationError)
//     { return res.status(400).json({ error: error.messages }); }
//     console.error("Error creando conductor:", error);
//     res.status(500).json({ error: "Error interno del servidor" });
// }
// })

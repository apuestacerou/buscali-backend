import { Request, Response, NextFunction } from 'express';
import { RutaService } from '../services/ruta-service';
import { CreateRutaDTO, UpdateRutaDTO } from '../dto/ruta-dto';
import { plainToInstance } from 'class-transformer';
import { checkDto } from '../../../shared/utils/checkDTO';
import { sendSuccess } from '../../../shared/utils/sendSuccess';

const service = new RutaService();

// Listar todos los conductores
export async function listRuta(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const rutas = await service.list();
    return sendSuccess(res, 200, 'Rutas listados correctamente', rutas);
  } catch (error) {
    next(error);
  }
}
// Obtener ruta por Nombre de la ruta
export async function getRuta(req: Request, res: Response, next: NextFunction) {
  try {
    const nombreRuta = req.params.nombre_ruta;
    const ruta = await service.get(nombreRuta);
    return sendSuccess(res, 200, 'Ruta encontrada', ruta);
  } catch (error) {
    next(error);
  }
}
//obtener ruta por nombre de la empresa
export async function getRutaByEmpresa(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const nombreEmpresa = req.params.nombre_empresa;
    const ruta = await service.getByEmpresa(nombreEmpresa);
    return sendSuccess(res, 200, 'Ruta encontrada', ruta);
  } catch (error) {
    next(error);
  }
}
//obtener ruta por destino
export async function getRutaByDestino(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const destino = req.params.destino;
    const ruta = await service.getByDestino(destino);
    return sendSuccess(res, 200, 'Ruta encontrada', ruta);
  } catch (error) {
    next(error);
  }
}

// Crear una nueva ruta
export async function createRuta(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // transforma y valida en un solo paso utilizando el helper
    const dto: CreateRutaDTO = plainToInstance(
      CreateRutaDTO,
      req.body as Record<string, unknown>,
    );
    await checkDto(dto);

    const newRuta = await service.create(dto);
    return sendSuccess(res, 201, 'Ruta creado correctamente', newRuta);
  } catch (error) {
    next(error);
  }
}
// Actualizar una ruta existente
// export async function updateRuta(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) {
//   try {
//     const cedula = req.params.cedula;
//     // transforma req.body(JSON) a UpdateConductorDTO y valida los datos usando class-validator
//     const dto = plainToInstance(
//       UpdateConductorDTO,
//       req.body as Record<string, unknown>,
//     );
//     await checkDto(dto);
//     const update = await service.update(cedula, dto);
//     return sendSuccess(res, 200, 'Conductor actualizado correctamente', update);
//   } catch (error) {
//     next(error);
//   }
// }
// Eliminar un conductor
// export async function deleteConductor(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) {
//   try {
//     const cedula = req.params.cedula;
//     await service.delete(cedula);
//     // 204 significa "No Content", no se devuelve body
//     return res.status(204).end();
//   } catch (error) {
//     next(error);
//   }
// }
// Login
// export async function loginConductor(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) {
//   try {
//     // transforma y valida el DTO
//     const dto: ConductorLoginDTO = plainToInstance(
//       ConductorLoginDTO,
//       req.body as Record<string, unknown>,
//     );
//     await checkDto(dto);
//     // lógica de login
//     const login = await service.login(dto);
//     // seteo de cookie segura
//     res.cookie('access_token', login.token, {
//       httpOnly: true, // solo accesible desde el servidor
//       secure: process.env.NODE_ENV === 'production', // solo por https en producción
//       sameSite: 'strict', // solo desde el mismo dominio
//       // maxAge: 1000 * 60 * 60 // opcional: 1 hora
//     });
//     return sendSuccess(res, 200, 'Sesión iniciada correctamente');
//   } catch (error) {
//     next(error);
//   }
// }
// //logout
// export async function logoutConductor(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) {
//   try {
//     // Borra la cookie que guarda el JWT
//     res.clearCookie('access_token', {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production', // usa true si estás en HTTPS en producción
//       sameSite: 'strict',
//     });
//     // Limpia el estado de autenticación en el request
//     req.auth = null;
//     return sendSuccess(res, 200, 'Sesión cerrada correctamente');
//   } catch (error) {
//     next(error);
//   }
// }
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

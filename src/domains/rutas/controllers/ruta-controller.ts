import { Request, Response, NextFunction } from 'express';
import { RutaService } from '../services/ruta-service';
import { CreateRutaDTO, UpdateRutaDTO } from '../dto/ruta-dto';
import { plainToInstance } from 'class-transformer';
import { checkDto } from '../../../shared/utils/checkDTO';
import { sendSuccess } from '../../../shared/utils/sendSuccess';
import { ValidationError } from '../../../shared/errors/error.class';

const service = new RutaService();

function queryCoord(v: unknown): number | null {
  if (v === undefined || v === null || v === '') return null;
  const n = typeof v === 'string' ? parseFloat(v) : Number(v);
  if (!Number.isFinite(n)) return null;
  return n;
}

export async function sugerirRutas(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const origenLat = queryCoord(req.query.origenLat);
    const origenLng = queryCoord(req.query.origenLng);
    const destinoLat = queryCoord(req.query.destinoLat);
    const destinoLng = queryCoord(req.query.destinoLng);

    if (
      origenLat === null ||
      origenLng === null ||
      destinoLat === null ||
      destinoLng === null
    ) {
      throw new ValidationError(
        'Indica origenLat, origenLng, destinoLat y destinoLng como números válidos.',
      );
    }
    if (origenLat < -90 || origenLat > 90 || destinoLat < -90 || destinoLat > 90) {
      throw new ValidationError(
        'La latitud debe estar entre -90 y 90 grados.',
      );
    }
    if (
      origenLng < -180 ||
      origenLng > 180 ||
      destinoLng < -180 ||
      destinoLng > 180
    ) {
      throw new ValidationError(
        'La longitud debe estar entre -180 y 180 grados.',
      );
    }

    const sugerencias = await service.sugerirRutas(
      origenLat,
      origenLng,
      destinoLat,
      destinoLng,
    );
    return sendSuccess(res, 200, 'Rutas sugeridas', sugerencias);
  } catch (error) {
    next(error);
  }
}

export async function puntosAccesoRuta(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const idRuta =
      typeof req.query.idRuta === 'string' ? req.query.idRuta.trim() : '';
    if (!idRuta) {
      throw new ValidationError(
        'Falta el parámetro idRuta (identificador de la ruta).',
      );
    }

    const origenLat = queryCoord(req.query.origenLat);
    const origenLng = queryCoord(req.query.origenLng);
    const destinoLat = queryCoord(req.query.destinoLat);
    const destinoLng = queryCoord(req.query.destinoLng);

    if (
      origenLat === null ||
      origenLng === null ||
      destinoLat === null ||
      destinoLng === null
    ) {
      throw new ValidationError(
        'Indica origenLat, origenLng, destinoLat y destinoLng como números válidos.',
      );
    }
    if (origenLat < -90 || origenLat > 90 || destinoLat < -90 || destinoLat > 90) {
      throw new ValidationError(
        'La latitud debe estar entre -90 y 90 grados.',
      );
    }
    if (
      origenLng < -180 ||
      origenLng > 180 ||
      destinoLng < -180 ||
      destinoLng > 180
    ) {
      throw new ValidationError(
        'La longitud debe estar entre -180 y 180 grados.',
      );
    }

    const puntos = await service.puntosAcceso(
      idRuta,
      origenLat,
      origenLng,
      destinoLat,
      destinoLng,
    );
    return sendSuccess(res, 200, 'Puntos de acceso al recorrido', puntos);
  } catch (error) {
    next(error);
  }
}

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
export async function updateRuta(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const nombre_ruta = req.params.nombre_ruta;
    // transforma req.body(JSON) a UpdateRutaDTO y valida los datos usando class-validator
    const dto = plainToInstance(
      UpdateRutaDTO,
      req.body as Record<string, unknown>,
    );
    await checkDto(dto);
    const update = await service.update(nombre_ruta, dto);
    return sendSuccess(res, 200, 'Ruta actualizada correctamente', update);
  } catch (error) {
    next(error);
  }
}

// Eliminar Ruta
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

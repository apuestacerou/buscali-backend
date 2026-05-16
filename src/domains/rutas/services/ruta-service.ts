import { RutaRepository } from '../repositories/ruta-repository';
import { EmpresaRepository } from '../../empresas/repositories/empresa_repository';
import { Ruta } from '../types/ruta';
import { CreateRutaDTO, UpdateRutaDTO, RutaResponseDTO } from '../dto/ruta-dto';
import {
  ConflictError,
  ValidationError,
} from '../../../shared/errors/error.class';
import {
  closestPointOnPolylineM,
  minDistanceToPolylineM,
  parseLineStringCoords,
} from '../utils/ruta-geometry';

export type RutaSugeridaDTO = {
  id_ruta: string;
  nombre_ruta: string;
  destino: string;
  nombre_empresa: string;
  /** Suma de distancias mínimas (m) desde origen y destino del usuario al trazado de la ruta; menor = más adecuada. */
  proximidad_total_m: number;
  coordenadas: { type: 'LineString'; coordinates: [number, number][] };
  colorhex: string;
};

export type PuntoParadaDTO = {
  latitud: number;
  longitud: number;
  distancia_desde_referencia_m: number;
};

export type PuntosAccesoRutaDTO = {
  id_ruta: string;
  nombre_ruta: string;
  /** Trazado completo de la ruta (GeoJSON LineString, SRID 4326). */
  coordenadas: { type: 'LineString'; coordinates: [number, number][] };
  colorhex: string;
  /** Proyección del origen del usuario sobre el trazado (donde conviene acercarse a la ruta para subir). */
  parada_subida: PuntoParadaDTO;
  /** Proyección del destino del usuario sobre el trazado (donde conviene descender). */
  parada_bajada: PuntoParadaDTO;
};

export class RutaService {
  private repo = new RutaRepository();
  private repoEmpresa = new EmpresaRepository();

  //obtener todos los ruta
  async list(): Promise<RutaResponseDTO[]> {
    const ruta: Ruta[] = await this.repo.findAllRutas();
    if (ruta.length === 0) {
      return [];
    }
    return ruta.map((c) => new RutaResponseDTO(c));
  }

  /**
   * Ordena rutas activas por cercanía del origen y destino del usuario al LINESTRING guardado en PostGIS.
   */
  async sugerirRutas(
    origenLat: number,
    origenLng: number,
    destinoLat: number,
    destinoLng: number,
  ): Promise<RutaSugeridaDTO[]> {
    const rutas = await this.repo.findAllRutasActivas();
    const scored: RutaSugeridaDTO[] = [];

    for (const r of rutas) {
      const coords = parseLineStringCoords(r.coordenadas as unknown);
      if (!coords) continue;

      const dOrigen = minDistanceToPolylineM(origenLat, origenLng, coords);
      const dDest = minDistanceToPolylineM(destinoLat, destinoLng, coords);
      if (!Number.isFinite(dOrigen) || !Number.isFinite(dDest)) continue;

      scored.push({
        id_ruta: r.id_ruta,
        nombre_ruta: r.nombre_ruta,
        destino: r.destino,
        nombre_empresa: r.empresa?.nombre_empresa ?? '',
        proximidad_total_m: Math.round(dOrigen + dDest),
        coordenadas: { type: 'LineString', coordinates: coords },
        colorhex: r.colorhex,
      });
    }

    scored.sort((a, b) => a.proximidad_total_m - b.proximidad_total_m);
    return scored;
  }

  /**
   * Para una ruta concreta, calcula sobre el LINESTRING el punto más cercano al origen y al destino del pasajero.
   */
  async puntosAcceso(
    id_ruta: string,
    origenLat: number,
    origenLng: number,
    destinoLat: number,
    destinoLng: number,
  ): Promise<PuntosAccesoRutaDTO> {
    const ruta = await this.repo.findRutaById(id_ruta);
    if (!ruta) {
      throw new ValidationError('No encontramos esa ruta.');
    }
    const coords = parseLineStringCoords(ruta.coordenadas as unknown);
    if (!coords) {
      throw new ValidationError(
        'Esta ruta no tiene un trazado válido en el mapa.',
      );
    }

    const sub = closestPointOnPolylineM(origenLat, origenLng, coords);
    const baj = closestPointOnPolylineM(destinoLat, destinoLng, coords);
    if (!sub || !baj) {
      throw new ValidationError(
        'No pudimos ubicar paradas sobre este recorrido. Comprueba las coordenadas.',
      );
    }

    return {
      id_ruta: ruta.id_ruta,
      nombre_ruta: ruta.nombre_ruta,
      coordenadas: { type: 'LineString' as const, coordinates: coords },
      colorhex: ruta.colorhex,
      parada_subida: {
        latitud: sub.latitud,
        longitud: sub.longitud,
        distancia_desde_referencia_m: sub.distancia_m,
      },
      parada_bajada: {
        latitud: baj.latitud,
        longitud: baj.longitud,
        distancia_desde_referencia_m: baj.distancia_m,
      },
    };
  }

  //obtener ruta por nombre_ruta
  async get(nombreRuta: string): Promise<RutaResponseDTO | null> {
    const ruta: Ruta | null = await this.repo.findRutaByNombre(nombreRuta);
    //verifica si la ruta existe, si no existe lanza un error
    if (!ruta) {
      throw new ValidationError('No encontramos esa ruta.');
    }

    return ruta ? new RutaResponseDTO(ruta) : null;
  }

  async getByEmpresa(nombreEmpresa: string): Promise<RutaResponseDTO | null> {
    const id_empresa: string | null =
      await this.repoEmpresa.findEmpresaByNombre(nombreEmpresa);
    //verifica si la ruta existe, si no existe lanza un error
    if (!id_empresa) {
      throw new ValidationError(
        'No encontramos una empresa con ese nombre. Revisa la información.',
      );
    }
    const ruta: Ruta | null = await this.repo.findRutaByEmpresa(id_empresa);
    if (!ruta) {
      throw new ValidationError(
        'Esa empresa aún no tiene rutas registradas en el sistema.',
      );
    }

    return new RutaResponseDTO(ruta);
  }

  async getByDestino(destino: string): Promise<RutaResponseDTO | null> {
    const ruta: Ruta | null = await this.repo.findRutaByDestino(destino);
    //verifica si la ruta existe, si no existe lanza un error
    if (!ruta) {
      throw new ValidationError(
        'No encontramos una ruta que llegue a ese destino.',
      );
    }
    return new RutaResponseDTO(ruta);
  }

  //crear ruta
  async create(dto: CreateRutaDTO): Promise<RutaResponseDTO> {
    //valida que no exista un ruta con la misma nombre_ruta
    const errors: string[] = [];

    const empresa_ruta = await this.repoEmpresa.findEmpresaByNombre(
      dto.nombre_empresa,
    );

    if (!empresa_ruta) {
      errors.push(
        `No encontramos la empresa «${dto.nombre_empresa}». Revisa el nombre.`,
      );
    }

    // transformar al formato GeoJSON antes de guardar en PostGIS:
    const geoJson = {
      type: 'LineString' as const,
      coordinates: dto.coordenadas.map(
        (p) => [p.lng, p.lat] as [number, number],
      ),
    };

    dto.id_empresa = empresa_ruta as string; // asigna el id_empresa encontrado al DTO

    const existing_ruta = await this.repo.findDuplicateRoute(
      dto.id_empresa,
      geoJson,
    );

    if (existing_ruta) {
      errors.push(
        'Ya existe una ruta con este mismo recorrido para esa empresa.',
      );
    }

    if (errors.length > 0) {
      throw new ConflictError(errors);
    }

    // 2. IMPORTANTE: Debes pasar el objeto ya transformado al repo
    // Puedes usar el spread operator para sobreescribir 'coordenadas'

    const c = await this.repo.createRuta({
      ...dto,
      coordenadas: geoJson,
    });
    //crea en la db y devuelve la nueva ruta
    return new RutaResponseDTO(c);
  }

  //actualizar ruta
  async update(
    nombre_ruta: string,
    dto: UpdateRutaDTO,
  ): Promise<RutaResponseDTO | null> {
    const errors: string[] = [];

    // Obtener la ruta existente por nombre para conseguir su id
    const ruta: Ruta | null = await this.repo.findRutaByNombre(nombre_ruta);
    if (!ruta) {
      throw new ValidationError('No encontramos una ruta con ese nombre.');
    }

    const existing_nombre = await this.repo.findRutaByNombre(nombre_ruta);
    if (existing_nombre && existing_nombre.nombre_ruta !== nombre_ruta) {
      throw new ValidationError('Ya existe una ruta con ese nombre.');
    }

    const existing_destino = await this.repo.findRutaByDestino(
      dto.destino || '',
    );
    if (existing_destino) {
      throw new ValidationError('Ya existe una ruta hacia ese destino.');
    }

    // Si se está actualizando el nombre de la empresa, verificar que exista
    const geoJson = {
      type: 'LineString' as const,
      coordinates: dto.coordenadas?.map(
        (p) => [p.lng, p.lat] as [number, number],
      ),
    };
    //verificar que no exista una ruta de la misma empresa con las mismas coordenadas
    const existing_ruta = await this.repo.findDuplicateRoute(
      dto.id_empresa!,
      geoJson,
    );
    if (existing_ruta) {
      throw new ValidationError(
        'Ya existe una ruta con este mismo recorrido para esa empresa.',
      );
    }

    if (errors.length > 0) {
      throw new ConflictError(errors);
    }

    // Actualizar usando el id_ruta y pasando datos transformados
    const updated = await this.repo.updateRuta(ruta.id_ruta, {
      ...dto,
      coordenadas: geoJson,
    });
    return updated ? new RutaResponseDTO(updated) : null;
  }

  //eliminar ruta por nombre_ruta
  // async delete(nombre_ruta: string): Promise<boolean> {
  //   const ruta: Ruta | null = await this.repo.findRutaByNombre(nombre_ruta);
  //   //verifica si el ruta existe, si no existe lanza un error
  //   if (!ruta) {
  //     throw new ValidationError('Ruta no encontrado');
  //   }
  //   return await this.repo.deleteRuta(nombre_ruta);
  // }
}

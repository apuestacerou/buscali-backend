import { RutaRepository } from '../repositories/ruta-repository';
import { EmpresaRepository } from '../../empresas/repositories/empresa_repository';
import { Ruta } from '../types/ruta';
import { CreateRutaDTO, UpdateRutaDTO, RutaResponseDTO } from '../dto/ruta-dto';
import {
  ConflictError,
  ValidationError,
} from '../../../shared/errors/error.class';

export class RutaService {
  private repo = new RutaRepository();
  private repoEmpresa = new EmpresaRepository();

  //obtener todos los ruta
  async list(): Promise<RutaResponseDTO[]> {
    const ruta: Ruta[] = await this.repo.findAllRutas();
    //verifica si hay ruta, si no hay lanza un error
    if (ruta.length === 0) {
      throw new ValidationError('Rutas no encontrados');
    }
    return ruta.map((c) => new RutaResponseDTO(c));
  }

  //obtener ruta por nombre_ruta
  async get(nombreRuta: string): Promise<RutaResponseDTO | null> {
    const ruta: Ruta | null = await this.repo.findRutaByNombre(nombreRuta);
    //verifica si la ruta existe, si no existe lanza un error
    if (!ruta) {
      throw new ValidationError('Ruta no encontrada');
    }

    return ruta ? new RutaResponseDTO(ruta) : null;
  }

  async getByEmpresa(nombreEmpresa: string): Promise<RutaResponseDTO | null> {
    const id_empresa: string | null =
      await this.repoEmpresa.findEmpresaByNombre(nombreEmpresa);
    //verifica si la ruta existe, si no existe lanza un error
    if (!id_empresa) {
      throw new ValidationError('Ruta no encontrada para esta empresa');
    }
    const ruta: Ruta | null = await this.repo.findRutaByEmpresa(id_empresa);
    if (!ruta) {
      throw new ValidationError('Ruta no encontrada para esta empresa');
    }

    return new RutaResponseDTO(ruta);
  }

  async getByDestino(destino: string): Promise<RutaResponseDTO | null> {
    const ruta: Ruta | null = await this.repo.findRutaByDestino(destino);
    //verifica si la ruta existe, si no existe lanza un error
    if (!ruta) {
      throw new ValidationError('Ruta no encontrada para este destino');
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
      errors.push(`La empresa ${dto.nombre_empresa} no existe.`);
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
        'Ya existe una ruta con este trayecto exacto para esta empresa',
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
      throw new ValidationError('Ruta no encontrado');
    }

    const existing_nombre = await this.repo.findRutaByNombre(nombre_ruta);
    if (existing_nombre && existing_nombre.nombre_ruta !== nombre_ruta) {
      throw new ValidationError('Ruta con este nombre ya existe');
    }

    const existing_destino = await this.repo.findRutaByDestino(
      dto.destino || '',
    );
    if (existing_destino) {
      throw new ValidationError('Ruta con este destino ya existe');
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
        'Ya existe una ruta con este trayecto exacto para esta empresa',
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

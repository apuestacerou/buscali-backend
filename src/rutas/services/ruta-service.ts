import { RutaRepository } from '../repositories/ruta-repository';
import { Ruta } from '../types/ruta';
import { CreateRutaDTO, UpdateRutaDTO, RutaResponseDTO } from '../dto/ruta-dto';
import { ConflictError, ValidationError } from '../../errors/error.class';

export class RutaService {
  private repo = new RutaRepository();

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
  // async get(nombre_ruta: string): Promise<RutaResponseDTO | null> {
  //   const ruta: Ruta | null = await this.repo.findRutaByNombre(nombre_ruta);
  //   //verifica si el ruta existe, si no existe lanza un error
  //   if (!ruta) {
  //     throw new ValidationError('Ruta no encontrado');
  //   }

  //   return ruta ? new RutaResponseDTO(ruta) : null;
  // }

  //crear ruta
  async create(dto: CreateRutaDTO): Promise<RutaResponseDTO> {
    //valida que no exista un ruta con la misma nombre_ruta
    const errors: string[] = [];

    const empresa_ruta = await this.repo.findEmpresaByNombre(
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
  // async update(
  //   nombre_ruta: string,
  //   dto: UpdateRutaDTO,
  // ): Promise<RutaResponseDTO | null> {
  //   const errors: string[] = [];

  //   //verificar que no exista una ruta de la misma empresa con las mismas coordenadas

  //   if (errors.length > 0) {
  //     throw new ConflictError(errors);
  //   }

  //   //actualiza en la db y devuelve el ruta
  //   const ruta: Ruta | null = await this.repo.findRutaByNombre(nombre_ruta);
  //   //verifica si el ruta existe, si no existe lanza un error
  //   if (!ruta) {
  //     throw new ValidationError('Ruta no encontrado');
  //   }

  //   const updated = await this.repo.updateRuta(nombre_ruta, dto);
  //   return updated ? new RutaResponseDTO(updated) : null;
  // }

  //eliminar ruta por nombre_ruta
  // async delete(nombre_ruta: string): Promise<boolean> {
  //   const ruta: Ruta | null = await this.repo.findRutaByNombre(nombre_ruta);
  //   //verifica si el ruta existe, si no existe lanza un error
  //   if (!ruta) {
  //     throw new ValidationError('Ruta no encontrado');
  //   }
  //   return await this.repo.deleteRuta(nombre_ruta);
  // }
  //Login
  // async login(dto: RutaLoginDTO): Promise<{ token: string }> {
  //   const errors: string[] = [];
  //   //valida que exista un ruta con ese destino
  //   const existing_ruta = await this.repo.findRutaByDestino(
  //     dto.destino,
  //   );

  //   {
  //     //muestra solo un error a la vez, porq es imposible tener los dos al tiempo
  //     // es imposible tener la contraseña mala para un destino q no existe
  //     // pero si es posible q el destino este malo
  //     // y q la contraseña este mal para un destino q si existe
  //   }
  //   if (!existing_ruta) {
  //     errors.push('Ruta con este destino no existe');
  //   } else {
  //     const isValid = await bcrypt.compare(
  //       dto.contrasena,
  //       existing_ruta.contrasena,
  //     );
  //     if (!isValid) {
  //       errors.push('Contraseña no Valida');
  //     }
  //   }
  //   if (errors.length > 0) {
  //     throw new ValidationError(errors);
  //   }
  //   const payload = {
  //     sub: existing_ruta!.nombre_ruta,
  //   };
  //   //jwt firmado
  //   // contenido, firma y expiracion
  //   const token = jwt.sign({ payload }, process.env.SECRET_JWT_KEY!, {
  //     expiresIn: '1h',
  //   });

  //   return { token };
  // }
}

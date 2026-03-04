import { ConductorRepository } from '../repositories/conductor-repository';
import { Conductor } from '../types/conductor';
import { CreateConductorDTO, UpdateConductorDTO, ConductorResponseDTO } from '../dto/conductor-dto';

export class ConductorService {
  private repo = new ConductorRepository();

  async create(dto: CreateConductorDTO): Promise<ConductorResponseDTO> {
    //valida que no exista un conductor con la misma cedula
    const existing_cedula = await this.repo.findConductorByCedula(dto.cedula);
    if (existing_cedula) {
      throw new Error('Conductor with this cedula already exists');
    }
    //valida que no exista un conductor con el mismo correo_electronico
    const existing_correo_electronico = await this.repo.findAllConductores().then(conductores => conductores.find(c => c.correo_electronico === dto.correo_electronico));
    if (existing_correo_electronico) {
      throw new Error('Conductor with this correo_electronico already exists');
    }
    //valida que no exista un conductor con el mismo telefono
    const existing_telefono = await this.repo.findAllConductores().then(conductores => conductores.find(c => c.telefono === dto.telefono));
    if (existing_telefono) {
      throw new Error('Conductor with this telefono already exists');
    }

    //crea en la db y devuelve el nuevo conductor
    const c = await this.repo.createConductor(dto);
    return new ConductorResponseDTO(c);
  }

  async list(): Promise<ConductorResponseDTO[]> {
    const conductores: Conductor[] = await this.repo.findAllConductores();
    //verifica si hay conductores, si no hay lanza un error
    if (conductores.length === 0) {
      throw new Error('No conductores found');
    }
    return conductores.map(c => new ConductorResponseDTO(c));
  }

  async get(cedula: bigint): Promise<ConductorResponseDTO | null> {
    const conductor: Conductor | null = await this.repo.findConductorByCedula(cedula);
    //verifica si el conductor existe, si no existe lanza un error
    if (!conductor) {
      throw new Error('Conductor not found');
    }
    return conductor ? new ConductorResponseDTO(conductor) : null;
  }

  async update(dto: UpdateConductorDTO): Promise<ConductorResponseDTO | null> {
    //valida que exista el conductor
    const existing_cedula = await this.repo.findConductorByCedula(dto.cedula);
    if (!existing_cedula) {
      throw new Error('Conductor not found');
    }
    //valida que no exista un conductor con el mismo correo_electronico
    const existing_correo_electronico = await this.repo.findAllConductores().then(conductores => conductores.find(c => c.correo_electronico === dto.correo_electronico));
    if (existing_correo_electronico) {
      throw new Error('Conductor with this correo_electronico already exists');
    }
    //valida que no exista un conductor con el mismo telefono
    const existing_telefono = await this.repo.findAllConductores().then(conductores => conductores.find(c => c.telefono === dto.telefono));
    if (existing_telefono) {
      throw new Error('Conductor with this telefono already exists');
    }

    //actualiza en la db y devuelve el conductor
    const updated = await this.repo.updateConductor(dto.cedula, dto);
    return updated ? new ConductorResponseDTO(updated) : null;
  }

  async delete(cedula: bigint): Promise<boolean> {
    const conductor: Conductor | null = await this.repo.findConductorByCedula(cedula);
    //verifica si el conductor existe, si no existe lanza un error
    if (!conductor) {
      throw new Error('Conductor not found');
    }
    return await this.repo.deleteConductor(cedula);
  }
}

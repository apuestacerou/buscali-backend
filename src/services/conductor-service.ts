import { ConductorRepository } from '../repositories/conductor-repository';
import { Conductor } from '../types/conductor';
import { CreateConductorDTO, UpdateConductorDTO, ConductorResponseDTO } from '../dto/conductor-dto';

export class ConductorService {
  private repo = new ConductorRepository();

  async create(dto: CreateConductorDTO): Promise<ConductorResponseDTO> {
    const c = await this.repo.createConductor(dto);
    return new ConductorResponseDTO(c);
  }

  async list(): Promise<ConductorResponseDTO[]> {
    const conductores: Conductor[] = await this.repo.findAllConductores();
    return conductores.map(c => new ConductorResponseDTO(c));
  }

  async get(id: number): Promise<ConductorResponseDTO | null> {
    const conductor: Conductor | null = await this.repo.findConductorById(id);
    return conductor ? new ConductorResponseDTO(conductor) : null;
  }

  async update(dto: UpdateConductorDTO): Promise<ConductorResponseDTO | null> {
    const updated = await this.repo.updateConductor(dto.id, dto);
    return updated ? new ConductorResponseDTO(updated) : null;
  }

  async delete(id: number): Promise<boolean> {
    return await this.repo.deleteConductor(id);
  }
}

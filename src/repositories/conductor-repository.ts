import { Conductor } from '../types/conductor'
import { ConductorModel } from "../models/conductor-model";

export class ConductorRepository {
  async findAllConductores(): Promise<Conductor[]> {
    const conductores = await ConductorModel.findAll();
    return conductores.map(c => c.toJSON() as Conductor);
  }

  async findConductorById(id: number): Promise<Conductor | null> {
    const conductor = await ConductorModel.findByPk(id);
    return conductor ? (conductor.toJSON() as Conductor) : null;
  }

  async createConductor(data: Omit<Conductor, "id" | "created_at">): Promise<Conductor> {
    const newConductor = await ConductorModel.create(data);
    return newConductor.toJSON() as Conductor;
  }

  async updateConductor(id: number, data: Partial<Conductor>): Promise<Conductor | null> {
    const conductor = await ConductorModel.findByPk(id);
    if (!conductor) return null;
    await conductor.update(data);
    return conductor.toJSON() as Conductor;
  }

  async deleteConductor(id: number): Promise<boolean> {
    const deleted = await ConductorModel.destroy({ where: { id } });
    return deleted > 0;
  }
}

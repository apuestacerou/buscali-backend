import { Conductor } from '../types/conductor';
import { ConductorModel } from '../../../shared/db/models/conductor-model';

export class ConductorRepository {
  //obtener todos los conductores
  async findAllConductores(): Promise<Conductor[]> {
    const conductores = await ConductorModel.findAll();
    return conductores.map((c) => c.toJSON() as Conductor);
  }

  //obtener conductores por cedula, telefono o correo usando los index de la db
  // sirven para la verificacion de existencia en la base de datos para evitar duplicados
  //cedula
  async findConductorByCedula(cedula: string): Promise<Conductor | null> {
    const conductor = await ConductorModel.findByPk(cedula);
    return conductor ? (conductor.toJSON() as Conductor) : null;
  }
  //correo
  async findConductorByCorreoElectronico(
    correo_electronico: string,
  ): Promise<Conductor | null> {
    const conductor = await ConductorModel.findOne({
      where: { correo_electronico },
    });
    return conductor ? (conductor.toJSON() as Conductor) : null;
  }
  //telefono
  async findConductorByTelefono(telefono: string): Promise<Conductor | null> {
    const conductor = await ConductorModel.findOne({ where: { telefono } });
    return conductor ? (conductor.toJSON() as Conductor) : null;
  }

  // crea un nuevo conductor en la base de datos, recibe un objeto con los datos del conductor excepto la fecha_creacion y dado el caso en que no se envien la contraseña y/o el estado se generaran automáticamente
  async createConductor(
    data: Omit<Conductor, 'fecha_creacion' | 'contrasena' | 'estado'>,
  ): Promise<Conductor> {
    const newConductor = await ConductorModel.create(data);
    return newConductor.toJSON() as Conductor;
  }

  //actualizar conductor
  async updateConductor(
    cedulaParametro: string,
    data: Partial<Conductor>,
  ): Promise<Conductor | null> {
    const conductor = await ConductorModel.findByPk(cedulaParametro);
    if (!conductor) {
      return null;
    }
    await conductor.update(data);
    return conductor.toJSON() as Conductor;
  }

  //eliminar conductor
  async deleteConductor(cedula: string): Promise<boolean> {
    const deleted = await ConductorModel.destroy({ where: { cedula } });
    return deleted > 0;
  }

  //forgot password: set reset token
  async setResetToken(correo: string, token: string, expires: Date): Promise<Conductor | null> {
    const conductor = await ConductorModel.findOne({ where: { correo_electronico: correo } });
    if (!conductor) return null;
    await conductor.update({ reset_token: token, reset_expires: expires });
    return conductor.toJSON() as Conductor;
  }

  //reset password: find by token and update password
  async resetPassword(token: string, newPassword: string): Promise<Conductor | null> {
    const conductor = await ConductorModel.findOne({ where: { reset_token: token } });
    if (!conductor || !conductor.reset_expires || conductor.reset_expires < new Date()) {
      return null;
    }
    await conductor.update({ contrasena: newPassword, reset_token: null, reset_expires: null });
    return conductor.toJSON() as Conductor;
  }
}

import { ConductorRepository } from '../repositories/conductor-repository';
import { Conductor } from '../types/conductor';
import {
  CreateConductorDTO,
  UpdateConductorDTO,
  ConductorResponseDTO,
  ConductorLoginDTO,
} from '../dto/conductor-dto';
import { ConflictError, ValidationError } from '../../errors/error.class';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class ConductorService {
  private repo = new ConductorRepository();

  //obtener todos los conductores
  async list(): Promise<ConductorResponseDTO[]> {
    const conductores: Conductor[] = await this.repo.findAllConductores();
    //verifica si hay conductores, si no hay lanza un error
    if (conductores.length === 0) {
      throw new ValidationError('Conductores no encontrados');
    }
    return conductores.map((c) => new ConductorResponseDTO(c));
  }

  //obtener conductor por cedula
  async get(cedula: string): Promise<ConductorResponseDTO | null> {
    const conductor: Conductor | null =
      await this.repo.findConductorByCedula(cedula);
    //verifica si el conductor existe, si no existe lanza un error
    if (!conductor) {
      throw new ValidationError('Conductor no encontrado');
    }
    return conductor ? new ConductorResponseDTO(conductor) : null;
  }

  //crear conductor
  async create(dto: CreateConductorDTO): Promise<ConductorResponseDTO> {
    //valida que no exista un conductor con la misma cedula
    const errors: string[] = [];

    const existing_cedula = await this.repo.findConductorByCedula(dto.cedula);
    if (existing_cedula) {
      errors.push('Conductor con esta cedula ya existe');
    }
    //valida que no exista un conductor con el mismo correo_electronico
    const existing_correo_electronico =
      await this.repo.findConductorByCorreoElectronico(dto.correo_electronico);
    if (existing_correo_electronico) {
      errors.push('Conductor con este correo electronico ya existe');
    }
    //valida que no exista un conductor con el mismo telefono
    const existing_telefono = await this.repo.findConductorByTelefono(
      dto.telefono,
    );
    if (existing_telefono) {
      errors.push('Conductor con este telefono ya existe');
    }
    if (errors.length > 0) {
      throw new ConflictError(errors);
    }

    //hashea la contraseña antes de guardarla en la base de datos
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(dto.contrasena || '', saltRounds);
    dto.contrasena = hashedPassword;

    //crea en la db y devuelve el nuevo conductor
    const c = await this.repo.createConductor(dto);
    return new ConductorResponseDTO(c);
  }

  //actualizar conductor
  async update(
    cedula: string,
    dto: UpdateConductorDTO,
  ): Promise<ConductorResponseDTO | null> {
    const errors: string[] = [];
    //valida que no exista un conductor con el mismo correo_electronico
    const existing_correo_electronico =
      await this.repo.findConductorByCorreoElectronico(
        dto.correo_electronico || '',
      );
    if (existing_correo_electronico) {
      errors.push('Conductor con este correo electronico ya existe');
    }
    //valida que no exista un conductor con el mismo telefono
    const existing_telefono = await this.repo.findConductorByTelefono(
      dto.telefono || '',
    );
    if (existing_telefono) {
      errors.push('Conductor con este telefono ya existe');
    }
    if (errors.length > 0) {
      throw new ConflictError(errors);
    }

    //actualiza en la db y devuelve el conductor
    const conductor: Conductor | null =
      await this.repo.findConductorByCedula(cedula);
    //verifica si el conductor existe, si no existe lanza un error
    if (!conductor) {
      throw new ValidationError('Conductor no encontrado');
    }

    const updated = await this.repo.updateConductor(cedula, dto);
    return updated ? new ConductorResponseDTO(updated) : null;
  }

  //eliminar conductor por cedula
  async delete(cedula: string): Promise<boolean> {
    const conductor: Conductor | null =
      await this.repo.findConductorByCedula(cedula);
    //verifica si el conductor existe, si no existe lanza un error
    if (!conductor) {
      throw new ValidationError('Conductor no encontrado');
    }
    return await this.repo.deleteConductor(cedula);
  }
  //Login
  async login(dto: ConductorLoginDTO): Promise<{ token: string }> {
    const errors: string[] = [];
    //valida que exista un conductor con ese telefono
    const existing_conductor = await this.repo.findConductorByTelefono(
      dto.telefono,
    );

    {
      //muestra solo un error a la vez, porq es imposible tener los dos al tiempo
      // es imposible tener la contraseña mala para un telefono q no existe
      // pero si es posible q el telefono este malo
      // y q la contraseña este mal para un telefono q si existe
    }
    if (!existing_conductor) {
      errors.push('Conductor con este telefono no existe');
    } else {
      const isValid = await bcrypt.compare(
        dto.contrasena,
        existing_conductor.contrasena,
      );
      if (!isValid) {
        errors.push('Contraseña no Valida');
      }
    }
    if (errors.length > 0) {
      throw new ValidationError(errors);
    }
    const payload = {
      sub: existing_conductor!.cedula,
    };
    //jwt firmado
    // contenido, firma y expiracion
    const token = jwt.sign({ payload }, process.env.SECRET_JWT_KEY!, {
      expiresIn: '1h',
    });

    return { token };
  }
}

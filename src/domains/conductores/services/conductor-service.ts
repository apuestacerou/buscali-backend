import { ConductorRepository } from '../repositories/conductor-repository';
import { Conductor } from '../types/conductor';
import {
  CreateConductorDTO,
  UpdateConductorDTO,
  ConductorResponseDTO,
  ConductorLoginDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
} from '../dto/conductor-dto';
import {
  ConflictError,
  ValidationError,
} from '../../../shared/errors/error.class';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

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
    //valida que acepte términos
    if (!dto.aceptaTerminos) {
      errors.push('Debe aceptar los términos y condiciones');
    }
    if (errors.length > 0) {
      throw new ConflictError(errors);
    }

    //hashea la contraseña antes de guardarla en la base de datos
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(dto.contrasena, saltRounds);
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

    if (!dto.correo_electronico && !dto.telefono) {
      errors.push('Debe proporcionar correo electrónico o teléfono');
    }

    let existing_conductor: Conductor | null = null;
    if (dto.correo_electronico) {
      existing_conductor = await this.repo.findConductorByCorreoElectronico(dto.correo_electronico);
      if (!existing_conductor) {
        errors.push('Conductor con este correo electrónico no existe');
      }
    } else if (dto.telefono) {
      existing_conductor = await this.repo.findConductorByTelefono(dto.telefono);
      if (!existing_conductor) {
        errors.push('Conductor con este teléfono no existe');
      }
    }

    if (existing_conductor) {
      const isValid = await bcrypt.compare(
        dto.contrasena,
        existing_conductor.contrasena,
      );
      if (!isValid) {
        errors.push('Contraseña no válida');
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

  //forgot password
  async forgotPassword(dto: ForgotPasswordDTO): Promise<void> {
    const conductor = await this.repo.findConductorByCorreoElectronico(dto.correo_electronico);
    if (!conductor) {
      throw new ValidationError('Correo electrónico no registrado');
    }

    const token = crypto.randomBytes(16).toString('hex');
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    await this.repo.setResetToken(dto.correo_electronico, token, expires);

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const frontendUrl = process.env.FRONTEND_URL;

    if (!emailUser || !emailPass) {
      throw new Error(
        'No se ha configurado EMAIL_USER o EMAIL_PASS en el archivo .env',
      );
    }

    if (!frontendUrl) {
      throw new Error('No se ha configurado FRONTEND_URL en el archivo .env');
    }

    // Enviar email
    const transporter = nodemailer.createTransport({
      service: 'gmail', // o el servicio que uses
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const mailOptions = {
      from: emailUser,
      to: dto.correo_electronico,
      subject: 'Recuperación de contraseña',
      text: `Usa este enlace para restablecer tu contraseña: ${frontendUrl}/reset-password?token=${token}`,
    };

    await transporter.sendMail(mailOptions);
  }

  //reset password
  async resetPassword(dto: ResetPasswordDTO): Promise<void> {
    const conductor = await this.repo.resetPassword(dto.token, await bcrypt.hash(dto.nueva_contrasena, 10));
    if (!conductor) {
      throw new ValidationError('Token inválido o expirado');
    }
  }
}

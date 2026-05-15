import type { Usuario } from '../types/usuario';
import { Usuario as UsuarioTable } from '../../../shared/db/models/Usuario';
import { Op } from 'sequelize';

function rowToUsuario(row: UsuarioTable): Usuario {
  const j = row.toJSON() as {
    id: number;
    nombre: string;
    apellido: string;
    email: string | null;
    telefono: string | null;
    passwordHash: string;
    createdAt: Date;
    resetToken?: string | null;
    resetExpires?: Date | null;
  };
  return {
    id_usuario: j.id,
    nombre: j.nombre,
    apellido: j.apellido,
    correo: j.email ?? '',
    telefono: j.telefono ?? undefined,
    password: j.passwordHash,
    fecha_registro: j.createdAt,
    reset_token: j.resetToken ?? null,
    reset_expires: j.resetExpires ?? null,
  };
}

export class UsuarioRepository {
  async findAllUsuarios(): Promise<Usuario[]> {
    const usuarios = await UsuarioTable.findAll({ order: [['id', 'ASC']] });
    return usuarios.map((u) => rowToUsuario(u));
  }

  async findUsuarioById(id_usuario: number): Promise<Usuario | null> {
    const usuario = await UsuarioTable.findByPk(id_usuario);
    return usuario ? rowToUsuario(usuario) : null;
  }

  async findUsuarioByCorreo(correo: string): Promise<Usuario | null> {
    const usuario = await UsuarioTable.findOne({
      where: { email: { [Op.iLike]: correo.trim() } },
    });
    return usuario ? rowToUsuario(usuario) : null;
  }

  async findUsuarioByTelefono(telefono: string): Promise<Usuario | null> {
    const usuario = await UsuarioTable.findOne({
      where: { telefono: telefono.trim() },
    });
    return usuario ? rowToUsuario(usuario) : null;
  }

  async createUsuario(
    data: Omit<Usuario, 'id_usuario' | 'fecha_registro'>,
  ): Promise<Usuario> {
    const newUsuario = await UsuarioTable.create({
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.correo,
      telefono: data.telefono ?? null,
      passwordHash: data.password,
      resetToken: data.reset_token ?? null,
      resetExpires: data.reset_expires ?? null,
    });
    return rowToUsuario(newUsuario);
  }

  async updateUsuario(
    id_usuario: number,
    data: Partial<Usuario>,
  ): Promise<Usuario | null> {
    const usuario = await UsuarioTable.findByPk(id_usuario);
    if (!usuario) {
      return null;
    }
    const patch: Record<string, unknown> = {};
    if (data.nombre !== undefined) patch.nombre = data.nombre;
    if (data.apellido !== undefined) patch.apellido = data.apellido;
    if (data.correo !== undefined) patch.email = data.correo;
    if (data.telefono !== undefined) patch.telefono = data.telefono;
    if (data.password !== undefined) patch.passwordHash = data.password;
    await usuario.update(patch);
    return rowToUsuario(usuario);
  }

  async deleteUsuario(id_usuario: number): Promise<boolean> {
    const deleted = await UsuarioTable.destroy({ where: { id: id_usuario } });
    return deleted > 0;
  }

  async setResetToken(
    correo: string,
    token: string,
    expires: Date,
  ): Promise<Usuario | null> {
    const usuario = await UsuarioTable.findOne({
      where: { email: { [Op.iLike]: correo.trim() } },
    });
    if (!usuario) return null;
    await usuario.update({ resetToken: token, resetExpires: expires });
    return rowToUsuario(usuario);
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<Usuario | null> {
    const usuario = await UsuarioTable.findOne({
      where: { resetToken: token },
    });
    if (!usuario || !usuario.resetExpires || usuario.resetExpires < new Date()) {
      return null;
    }
    await usuario.update({
      passwordHash: newPassword,
      resetToken: null,
      resetExpires: null,
    });
    return rowToUsuario(usuario);
  }
}

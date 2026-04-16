import { Usuario } from '../types/usuario';
import { UsuarioModel } from '../../../shared/db/models/usuario-model';

export class UsuarioRepository {
  async findAllUsuarios(): Promise<Usuario[]> {
    const usuarios = await UsuarioModel.findAll();
    return usuarios.map((u) => u.toJSON() as Usuario);
  }

  async findUsuarioById(id_usuario: number): Promise<Usuario | null> {
    const usuario = await UsuarioModel.findByPk(id_usuario);
    return usuario ? (usuario.toJSON() as Usuario) : null;
  }

  async findUsuarioByCorreo(correo: string): Promise<Usuario | null> {
    const usuario = await UsuarioModel.findOne({ where: { correo } });
    return usuario ? (usuario.toJSON() as Usuario) : null;
  }

  async findUsuarioByTelefono(telefono: string): Promise<Usuario | null> {
    const usuario = await UsuarioModel.findOne({ where: { telefono } });
    return usuario ? (usuario.toJSON() as Usuario) : null;
  }

  /**
   * Crea un nuevo usuario en la base de datos.
   */
  async createUsuario(
    data: Omit<Usuario, 'id_usuario' | 'fecha_registro'>,
  ): Promise<Usuario> {
    const newUsuario = await UsuarioModel.create(data as any);
    return newUsuario.toJSON() as Usuario;
  }

  async updateUsuario(
    id_usuario: number,
    data: Partial<Usuario>,
  ): Promise<Usuario | null> {
    const usuario = await UsuarioModel.findByPk(id_usuario);
    if (!usuario) {
      return null;
    }
    await usuario.update(data as any);
    return usuario.toJSON() as Usuario;
  }

  async deleteUsuario(id_usuario: number): Promise<boolean> {
    const deleted = await UsuarioModel.destroy({ where: { id_usuario } });
    return deleted > 0;
  }

  async setResetToken(
    correo: string,
    token: string,
    expires: Date,
  ): Promise<Usuario | null> {
    const usuario = await UsuarioModel.findOne({ where: { correo } });
    if (!usuario) return null;
    await usuario.update({ reset_token: token, reset_expires: expires });
    return usuario.toJSON() as Usuario;
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<Usuario | null> {
    const usuario = await UsuarioModel.findOne({ where: { reset_token: token } });
    if (!usuario || !usuario.reset_expires || usuario.reset_expires < new Date()) {
      return null;
    }
    await usuario.update({
      password: newPassword,
      reset_token: null,
      reset_expires: null,
    });
    return usuario.toJSON() as Usuario;
  }
}

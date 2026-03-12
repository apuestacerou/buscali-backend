import { Request, Response } from 'express';
import { Usuario, RolUsuario } from '../models/Usuario';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/** Listar todos los usuarios (sin exponer passwordHash en JSON) */
export async function listar(req: Request, res: Response): Promise<void> {
  try {
    const usuarios = await Usuario.findAll({
      order: [['id', 'ASC']],
      attributes: { exclude: ['passwordHash'] },
    });
    res.json(usuarios);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al listar usuarios' });
  }
}

/** Obtener un usuario por id */
export async function obtenerPorId(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: 'ID inválido' });
      return;
    }
    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ['passwordHash'] },
    });
    if (!usuario) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }
    res.json(usuario);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
}

/** Crear usuario. Body: { nombre, email?, telefono?, password, rol? } */
export async function crear(req: Request, res: Response): Promise<void> {
  try {
    const { nombre, email, telefono, password, rol } = req.body as {
      nombre?: string;
      email?: string;
      telefono?: string;
      password?: string;
      rol?: string;
    };
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
      res.status(400).json({ error: 'El campo nombre es obligatorio' });
      return;
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      res.status(400).json({ error: 'La contraseña es obligatoria y debe tener al menos 6 caracteres' });
      return;
    }
    const pwd = password as string;
    const rolValido: RolUsuario = ['pasajero', 'conductor', 'administrador'].includes(rol ?? '')
      ? (rol as RolUsuario)
      : 'pasajero';
    const passwordHash = await bcrypt.hash(pwd, SALT_ROUNDS);
    const usuario = await Usuario.create({
      nombre: nombre.trim(),
      email: email != null ? String(email).trim() || null : null,
      telefono: telefono != null ? String(telefono).trim() || null : null,
      passwordHash,
      rol: rolValido,
    });
    const salida = usuario.toJSON();
    delete (salida as Record<string, unknown>).passwordHash;
    res.status(201).json(salida);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
}

/** Actualizar usuario. Body: { nombre?, email?, telefono?, password?, rol? } */
export async function actualizar(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: 'ID inválido' });
      return;
    }
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }
    const { nombre, email, telefono, password, rol } = req.body as {
      nombre?: string;
      email?: string;
      telefono?: string;
      password?: string;
      rol?: string;
    };
    if (nombre !== undefined) usuario.nombre = String(nombre).trim();
    if (email !== undefined) usuario.email = email === '' ? null : String(email).trim();
    if (telefono !== undefined) usuario.telefono = telefono === '' ? null : String(telefono).trim();
    if (rol !== undefined && ['pasajero', 'conductor', 'administrador'].includes(rol)) {
      usuario.rol = rol as RolUsuario;
    }
    if (password !== undefined && password !== '') {
      if (password.length < 6) {
        res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
        return;
      }
      const pwd = password as string;
      usuario.passwordHash = await bcrypt.hash(pwd, SALT_ROUNDS);
    }
    await usuario.save();
    const salida = usuario.toJSON();
    delete (salida as Record<string, unknown>).passwordHash;
    res.json(salida);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
}

/** Eliminar usuario */
export async function eliminar(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: 'ID inválido' });
      return;
    }
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }
    await usuario.destroy();
    res.status(204).send();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
}

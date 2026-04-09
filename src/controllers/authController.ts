/**
 * Autenticación: login contra la tabla usuarios (bcrypt).
 */

import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { Usuario } from '../models/Usuario';

/**
 * POST /api/auth/login
 * Body: identificador (correo o teléfono), password
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { identificador, password } = req.body as {
      identificador?: string;
      password?: string;
    };

    const id = typeof identificador === 'string' ? identificador.trim() : '';
    if (!id) {
      res.status(400).json({ error: 'El correo o teléfono es obligatorio' });
      return;
    }
    if (!password || typeof password !== 'string') {
      res.status(400).json({ error: 'La contraseña es obligatoria' });
      return;
    }

    let usuario: Usuario | null = null;

    if (id.includes('@')) {
      usuario = await Usuario.findOne({
        where: { email: { [Op.iLike]: id } },
      });
    } else {
      usuario = await Usuario.findOne({
        where: { telefono: id },
      });
    }

    if (!usuario) {
      res.status(401).json({ error: 'Credenciales incorrectas' });
      return;
    }

    const coincide = await bcrypt.compare(password, usuario.passwordHash);
    if (!coincide) {
      res.status(401).json({ error: 'Credenciales incorrectas' });
      return;
    }

    const salida = usuario.toJSON();
    delete (salida as Record<string, unknown>).passwordHash;
    res.json(salida);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
}

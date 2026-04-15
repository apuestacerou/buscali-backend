/**
 * Autenticación: login contra la tabla usuarios (bcrypt).
 */

import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { Usuario } from '../models/Usuario';
import { validatePassword, getStrengthInfo } from '../utils/passwordValidator';
import { generateToken } from '../middleware/auth';
import { validatePassword, getStrengthInfo } from '../utils/passwordValidator';

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

    // Generar JWT
    const token = generateToken(usuario.id, usuario.email, usuario.rol);

    const salida = usuario.toJSON();
    delete (salida as Record<string, unknown>).passwordHash;
    
    res.json({
      usuario: salida,
      token,
      expiresIn: '7d',
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
}

/**
 * GET /api/auth/password-strength
 * Query: password
 * Devuelve información visual sobre la fortaleza de la contraseña en tiempo real
 */
export async function getPasswordStrength(req: Request, res: Response): Promise<void> {
  try {
    const { password } = req.query as { password?: string };

    if (!password || typeof password !== 'string') {
      res.status(400).json({
        error: 'La contraseña es obligatoria como parámetro de consulta',
        example: '/api/auth/password-strength?password=MiContraseña123!',
      });
      return;
    }

    const validation = validatePassword(password);
    const strengthInfo = getStrengthInfo(validation.strength);

    res.json({
      password: '*'.repeat(password.length), // Ocultar contraseña real
      strength: validation.strength,
      isValid: validation.isValid,
      strengthInfo,
      requirements: validation.score,
      errors: validation.errors,
      suggestions: validation.suggestions,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al evaluar la fortaleza de la contraseña' });
  }
}

/**
 * GET /api/auth/password-strength
 * Query: password
 * Devuelve información visual sobre la fortaleza de la contraseña en tiempo real
 */
export async function getPasswordStrength(req: Request, res: Response): Promise<void> {
  try {
    const { password } = req.query as { password?: string };

    if (!password || typeof password !== 'string') {
      res.status(400).json({
        error: 'La contraseña es obligatoria como parámetro de consulta',
        example: '/api/auth/password-strength?password=MiContraseña123!',
      });
      return;
    }

    const validation = validatePassword(password);
    const strengthInfo = getStrengthInfo(validation.strength);

    res.json({
      password: '*'.repeat(password.length), // Ocultar contraseña real por seguridad
      strength: validation.strength,
      isValid: validation.isValid,
      strengthInfo,
      requirements: validation.score,
      errors: validation.errors,
      suggestions: validation.suggestions,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al evaluar la fortaleza de la contraseña' });
  }
}

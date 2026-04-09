/**
 * Punto de entrada del backend Buscali.
 * Carga variables de entorno, configura Express, monta rutas e inicia el servidor.
 */

import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import { sequelize } from './config/database';
import usuariosRoutes from './routes/usuariosRoutes';
import authRoutes from './routes/authRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (_req, res) => {
  // Ruta raíz: devuelve info del API y endpoints disponibles
  res.json({
    service: 'Buscali Backend',
    message: 'API de movilidad urbana - Cali',
    endpoints: {
      health: 'GET /health',
      authLogin: 'POST /api/auth/login',
      usuarios: 'GET, POST /api/usuarios',
      usuarioPorId: 'GET, PUT, DELETE /api/usuarios/:id',
    },
  });
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'buscali-backend' });
});

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);

app.use((_req, res) => {
  // Cualquier ruta no definida arriba devuelve 404 con mensaje útil
  res.status(404).json({
    error: 'No encontrado',
    message: 'La ruta no existe. Prueba: GET / , GET /health , POST /api/auth/login , GET /api/usuarios',
    path: _req.path,
  });
});

async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a Postgres (Neon) correcta');
    // alter: aplica cambios del modelo a la tabla (p. ej. columna apellido). En producción conviene migraciones SQL explícitas.
    await sequelize.sync({ alter: true });
    console.log('✅ Tablas sincronizadas');
  } catch (e) {
    console.error('❌ Error al conectar con la base de datos:', e);
    process.exit(1);
  }
  app.listen(PORT, () => {
    console.log(`🚀 Servidor en http://localhost:${PORT}`);
  });
}

// Arrancamos el servidor al cargar este archivo

start();

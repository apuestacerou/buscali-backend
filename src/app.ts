import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import { sequelize } from './config/database';
import usuariosRoutes from './routes/usuariosRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    service: 'Buscali Backend',
    message: 'API de movilidad urbana - Cali',
    endpoints: {
      health: 'GET /health',
      usuarios: 'GET, POST /api/usuarios',
      usuarioPorId: 'GET, PUT, DELETE /api/usuarios/:id',
    },
  });
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'buscali-backend' });
});

app.use('/api/usuarios', usuariosRoutes);

app.use((_req, res) => {
  res.status(404).json({
    error: 'No encontrado',
    message: 'La ruta no existe. Prueba: GET / , GET /health , GET /api/usuarios',
    path: _req.path,
  });
});

async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a Postgres (Neon) correcta');
    await sequelize.sync();
    console.log('✅ Tablas sincronizadas');
  } catch (e) {
    console.error('❌ Error al conectar con la base de datos:', e);
    process.exit(1);
  }
  app.listen(PORT, () => {
    console.log(`🚀 Servidor en http://localhost:${PORT}`);
  });
}

start();

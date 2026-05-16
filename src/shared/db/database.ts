import { Sequelize } from 'sequelize-typescript';
import { ConductorModel } from './models/conductor-model';
import { RutaModel } from './models/ruta-model';
import { EmpresaModel } from './models/empresa-model';
import { Usuario } from './models/Usuario';

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) {
  throw new Error(
    'Falta DATABASE_URL. Copia .env.example a .env en la raíz del proyecto y asigna la cadena de conexión PostgreSQL (p. ej. de Neon).',
  );
}

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  timezone: process.env.TIMEZONE,
  /** Neon/servidor Postgres en la nube suelen cortar conexiones inactivas (ECONNRESET); el pool reduce fallos. */
  pool: {
    max: 5,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true, // útil si no tienes certificado CA
    },
  },
  models: [ConductorModel, RutaModel, EmpresaModel, Usuario], // carga modelos desde la carpeta models
});

export { sequelize };

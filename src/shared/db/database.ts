import { Sequelize } from 'sequelize-typescript';
import { ConductorModel } from './models/conductor-model';
import { RutaModel } from './models/ruta-model';
import { EmpresaModel } from './models/empresa-model';
import { UsuarioModel } from './models/usuario-model';

const databaseUrl = process.env.DATABASE_URL;
const isSsl = process.env.DB_SSL === 'true';
const timezone = process.env.TIMEZONE || 'UTC';

const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, {
      dialect: 'postgres',
      timezone,
      dialectOptions: isSsl
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {},
      models: [ConductorModel, RutaModel, EmpresaModel, UsuarioModel],
    })
  : new Sequelize({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 5432),
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      timezone,
      dialectOptions: isSsl
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {},
      models: [ConductorModel, RutaModel, EmpresaModel, UsuarioModel],
    });

export { sequelize };

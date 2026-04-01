import { Sequelize } from 'sequelize-typescript';
import { ConductorModel } from '../models/conductor-model';

const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // útil si no tienes certificado CA
    },
  },
  models: [ConductorModel], // carga modelos desde la carpeta models
});

export { sequelize };
import { Sequelize } from 'sequelize-typescript';
import { ConductorModel } from '../conductores/models/conductor-model';
import { RutaModel } from '../rutas/models/ruta-model';
import { EmpresaModel } from '../rutas/models/empresa-model';

const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true, // útil si no tienes certificado CA
    },
  },
  models: [ConductorModel, RutaModel, EmpresaModel], // carga modelos desde la carpeta models
});

export { sequelize };

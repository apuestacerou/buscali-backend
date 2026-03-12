import { Sequelize } from 'sequelize-typescript';
import { Usuario } from '../models/Usuario';

const isNeonUrl = !!process.env.DATABASE_URL;

const sequelize = isNeonUrl
  ? new Sequelize(process.env.DATABASE_URL!, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false },
      },
      models: [Usuario],
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
    })
  : new Sequelize({
      database: process.env.DB_NAME,
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      password: process.env.DB_PASSWORD,
      username: process.env.DB_USER,
      models: [Usuario],
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
    });

export { sequelize };
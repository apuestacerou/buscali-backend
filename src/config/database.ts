import { Sequelize } from 'sequelize-typescript';
import { ConductorModel } from '../models/conductor-model';

const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    password: process.env.DB_PASSWORD,
    username: process.env.DB_USER,
    models: [ConductorModel],
});

export { sequelize };
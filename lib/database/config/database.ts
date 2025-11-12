import { Sequelize } from 'sequelize';
import * as pg from 'pg';

const sequelize = new Sequelize({
  dialect: 'postgres',
  dialectModule: pg,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'rh-helper-db',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'admin',
  logging: process.env.DB_LOGGING === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: true,
  },
});

export default sequelize;

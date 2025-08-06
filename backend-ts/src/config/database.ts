import { Sequelize } from 'sequelize';
import { config } from './config';

export const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: 'postgres',
  }
);

export const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Database connection successs.');
  } catch (error) {
    console.error('Err to connect database:', error);
    process.exit(2);
  }
}; 
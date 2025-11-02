import sequelize from './config/database';

export async function testConnection(): Promise<boolean> {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
}

if (require.main === module) {
  testConnection().then(() => process.exit(0));
}

// db.js
import { Sequelize } from 'sequelize';

// Initialize a new Sequelize instance with your database configuration
const sequelize = new Sequelize({
  dialect: 'mysql', // or 'postgres', 'sqlite', etc.
  host: 'localhost', // Database host
  username: 'admin',  // Database username
  password: 'Mbry8992@',      // Database password
  database: 'olopage',  // Database name
});

// Authenticate the connection
async function authenticate() {
  try {
    await sequelize.authenticate();
    console.log('Connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
authenticate();
export { sequelize }; // Export sequelize instance
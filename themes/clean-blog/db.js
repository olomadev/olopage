// db.js
import { Sequelize } from 'sequelize';

// Initialize a new Sequelize instance with your database configuration
const sequelize = new Sequelize({
  dialect: 'mysql', // or 'postgres', 'sqlite', etc.
  host: 'localhost', // Database host
  username: 'admin',  // Database username
  password: 'Mbry8992@',      // Database password
  database: 'olopage',  // Database name
  logging: false,  // SQL sorgularının loglanmasını engeller
});

export { sequelize }; // Export sequelize instance
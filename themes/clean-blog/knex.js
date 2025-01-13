// knexConfig.js
import knex from 'knex';

const knexInstance = knex({
  client: 'mysql2',
  connection: {
    host: '127.0.0.1',
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'olopage'
  },
  pool: { min: 0, max: 10 },
  migrations: {
    tableName: 'knex_migrations'
  }
});

export default knexInstance;

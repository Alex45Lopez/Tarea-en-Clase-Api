require('dotenv').config();
const mysql = require('mysql2/promise');

const poolConfig = process.env.DB_SOCKET
  ? { socketPath: process.env.DB_SOCKET, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME }
  : { host: process.env.DB_HOST, port: process.env.DB_PORT || 3306, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME };

module.exports = mysql.createPool({ ...poolConfig, waitForConnections: true, connectionLimit: 10, queueLimit: 0 });

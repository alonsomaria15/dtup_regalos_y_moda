import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // tu contraseña
  database: 'dtup_regalos_y_moda',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

import mysql from 'mysql2/promise'; 
export const pool = mysql.createPool({ 
    host: 'localhost', 
    user: 'lupita', 
    password: '123456', // tu contraseña 
    database: 'dtup_regalos_y_moda', 
    waitForConnections: true, 
    connectionLimit: 10, 
    queueLimit: 0 });
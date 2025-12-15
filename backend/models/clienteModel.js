import { pool } from '../db.js';

export const agregarCliente = async (cliente) => {
  const { nombre, telefono, direccion } = cliente;
  const [resultado] = await pool.query(
    `INSERT INTO clientes (nombre, telefono, direccion) VALUES (?, ?, ?)`,
    [nombre, telefono, direccion]
  );
  return resultado.insertId;
};

export const obtenerClientes = async () => {
  const [rows] = await pool.query('SELECT * FROM clientes');
  return rows;
};

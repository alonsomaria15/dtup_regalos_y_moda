import { pool } from '../db.js';

export const agregarProducto = async (producto) => {
  const { codigo, nombre, descripcion, precio_venta, precio_compra, id_categoria, id_genero, id_tipo, id_sucursal, imagen } = producto;
  const [resultado] = await pool.query(
    `INSERT INTO productos (codigo, nombre, descripcion, precio_venta, precio_compra, id_categoria, id_genero, id_tipo, id_sucursal, imagen)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [codigo, nombre, descripcion, precio_venta, precio_compra, id_categoria, id_genero, id_tipo, id_sucursal, imagen]
  );
  return resultado.insertId;
};

export const obtenerProductos = async () => {
  const [rows] = await pool.query('SELECT * FROM productos');
  return rows;
};

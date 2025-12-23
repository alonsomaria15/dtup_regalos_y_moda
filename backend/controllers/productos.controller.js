import { pool } from '../db.js';
import path from 'path';

// 🟢 Obtener todos los productos
export const getProductos = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.id_producto,
        p.codigo,
        p.nombre,
        p.precio_venta,
        p.precio_compra,
        p.stock,
        id_sucursal,
        p.activo,
        p.imagen
      FROM productos p
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// 🟡 Agregar producto (con multer)
export const agregarProductos = async (req, res) => {
  try {
    // Generar un código único automáticamente si no lo envías
    const codigo = req.body.codigo || 'PRD' + Date.now(); 

    const nombre = req.body.nombre;
    const precio_venta = req.body.precio_venta;
    const precio_compra = req.body.precio_compra;
    const id_categoria = req.body.id_categoria;
    const id_tipo = req.body.id_tipo;
    const id_genero = req.body.id_genero || null;
    const stock = req.body.stock || 0;
    const id_sucursal = req.body.id_sucursal || 1; // por default
    const activo = req.body.activo || 1;
    const imagen = req.file ? req.file.path : null;

    const [result] = await pool.query(
      `INSERT INTO productos 
      (codigo, nombre, precio_venta, precio_compra, stock, id_sucursal, activo, imagen, id_categoria, id_tipo, id_genero)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [codigo, nombre, precio_venta, precio_compra, stock, id_sucursal, activo, imagen, id_categoria, id_tipo, id_genero]
    );

    res.json({ id_producto: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al agregar producto' });
  }
};

// 🟠 Actualizar producto
export const actualizarProductos = async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo, nombre, precio_venta, precio_compra, stock } = req.body;
    const imagen = req.file ? req.file.path : null;

    await pool.query(
      `UPDATE productos SET codigo=?, nombre=?, precio_venta=?, precio_compra=?, stock=?, id_sucursal=?, activo=?, imagen=? WHERE id_producto=?`,
      [codigo, nombre, precio_venta, precio_compra, stock || 0, 1, 1, imagen, id]
    );

    res.json({ message: 'Producto actualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

// 🔴 Eliminar producto
export const eliminarProductos = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM productos WHERE id_producto=?`, [id]);
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};

import pool from '../db.js'; // conexión a MySQL

export const agregarProducto = async (req, res) => {
  try {
    const { nombre, id_categoria, id_genero, id_tipo, precio_venta, stock } = req.body;
    const imagen = req.file ? req.file.filename : null;

    const [result] = await pool.query(
      'INSERT INTO productos (nombre, id_categoria, id_genero, id_tipo, precio_venta, stock, imagen, id_sucursal) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [nombre, id_categoria, id_genero, id_tipo, precio_venta, stock, imagen, 1] // ejemplo: sucursal 1
    );

    res.json({ id_producto: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al agregar producto' });
  }
};

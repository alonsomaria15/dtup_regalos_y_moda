import { pool } from '../db.js';

export const obtenerTiposProducto = async (req, res) => {
  try {
    const { id_categoria } = req.query;

    let query = 'SELECT id_tipo, nombre, id_categoria FROM tipos_producto';
    const params = [];

    if (id_categoria) {
      query += ' WHERE id_categoria = ?';
      params.push(id_categoria);
    }

    query += ' ORDER BY nombre';

    const [rows] = await pool.query(query, params);
    res.json(rows);

  } catch (error) {
    console.error("ERROR obtenerTiposProducto:", error);
    res.status(500).json({ message: 'Error al obtener tipos de producto' });
  }
};

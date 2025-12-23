import { pool } from '../db.js';

export const obtenerCategorias = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id_categoria, nombre FROM categorias WHERE activo = 'S'"
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener categorías' });
  }
};

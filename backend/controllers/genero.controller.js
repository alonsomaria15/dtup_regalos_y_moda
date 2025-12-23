import { pool } from '../db.js';

export const obtenerGenero = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id_genero, nombre FROM generos WHERE activo = 'S'"
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener genero' });
  }
};

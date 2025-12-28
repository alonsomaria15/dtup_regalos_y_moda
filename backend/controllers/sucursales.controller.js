// backend/controllers/sucursales.controller.js
import { pool } from '../db.js';

// 🟢 Obtener todas las sucursales activas
export const getSucursales = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM sucursales WHERE activo="S"');
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener sucursales:', err);
    res.status(500).json({ error: 'Error al obtener sucursales' });
  }
};

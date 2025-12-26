import { pool } from '../db.js';

// 🟢 Agregar variantes
export const agregarVariantes = async (req, res) => {
  try {
    const { id_producto, variantes } = req.body;

    if (!id_producto || !Array.isArray(variantes) || variantes.length === 0) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    const values = variantes.map((v) => [
      id_producto,
      v.modelo,
      v.color,
      v.talla,
    ]);

    await pool.query(
      `INSERT INTO variantes (id_producto, modelo, color, talla) VALUES ?`,
      [values]
    );

    res.json({ message: '✅ Variantes agregadas correctamente' });
  } catch (error) {
    console.error('❌ Error al insertar variantes:', error);
    res.status(500).json({ error: 'Error al registrar variantes' });
  }
};

// 🟢 Obtener variantes de un producto
export const obtenerVariantesPorProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM variantes WHERE id_producto = ?",
      [id]
    );
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener variantes:", error);
    res.status(500).json({ error: "Error al obtener variantes" });
  }
};

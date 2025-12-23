import { pool } from "../db.js";

// Registrar un nuevo abono
export const agregarAbono = async (req, res) => {
  const { id_venta, monto, metodo_pago, observaciones } = req.body;

  if (!id_venta || monto == null) {
    return res.status(400).json({ error: "Faltan datos del abono" });
  }

  try {
    // Insertar abono
    await pool.query(
      `INSERT INTO abonos (id_venta, fecha, monto, metodo_pago, observaciones)
       VALUES (?, NOW(), ?, ?, ?)`,
      [id_venta, monto, metodo_pago || "efectivo", observaciones || ""]
    );

    // Calcular total abonado
    const [[{ suma }]] = await pool.query(
      `SELECT SUM(monto) AS suma FROM abonos WHERE id_venta = ?`,
      [id_venta]
    );

    // Obtener total final de la venta
    const [[{ total_final }]] = await pool.query(
      `SELECT total_final FROM ventas WHERE id_venta = ?`,
      [id_venta]
    );

    // Si ya se pagó todo, marcar la venta como PAGADO
    if (suma >= total_final) {
      await pool.query(`UPDATE ventas SET estado = 'PAGADO' WHERE id_venta = ?`, [id_venta]);
    }

    res.json({ mensaje: "✅ Abono registrado correctamente", total_abonado: suma });
  } catch (err) {
    console.error("❌ Error al agregar abono:", err);
    res.status(500).json({ error: "Error al agregar abono" });
  }
};

// Obtener todos los abonos de una venta
export const obtenerAbonosPorVenta = async (req, res) => {
  const { id_venta } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT id_abono, fecha, monto, metodo_pago, observaciones 
       FROM abonos WHERE id_venta = ? ORDER BY fecha ASC`,
      [id_venta]
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Error al obtener abonos:", err);
    res.status(500).json({ error: "Error al obtener abonos" });
  }
};

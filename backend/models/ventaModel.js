import { pool } from '../db.js';

export const crearVenta = async (venta, detalles) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [resVenta] = await conn.query(
      `INSERT INTO ventas (id_cliente, id_sucursal, total, total_final, estado) VALUES (?, ?, ?, ?, ?)`,
      [venta.id_cliente, venta.id_sucursal, venta.total, venta.total_final, venta.estado]
    );
    const id_venta = resVenta.insertId;

    for (const d of detalles) {
      await conn.query(
        `INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_original, precio_vendido, subtotal)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id_venta, d.id_producto, d.cantidad, d.precio_original, d.precio_vendido, d.subtotal]
      );
    }

    await conn.commit();
    return id_venta;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

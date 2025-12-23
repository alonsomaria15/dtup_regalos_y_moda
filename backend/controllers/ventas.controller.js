import { pool } from "../db.js";

/* =========================================================
   REGISTRAR VENTA
========================================================= */
export const registrarVenta = async (req, res) => {
  const {
    carrito,
    total,
    total_final,
    id_cliente,
    id_sucursal,
    abono_inicial,
    metodo_pago,
    estado,
    observaciones,
    esCredito,
  } = req.body;

  if (!carrito || carrito.length === 0) {
    return res.status(400).json({ error: "El carrito está vacío" });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Insertar venta principal
    const [ventaResult] = await conn.query(
      `INSERT INTO ventas (fecha, id_cliente, id_sucursal, total, total_final, estado)
       VALUES (NOW(), ?, ?, ?, ?, ?)`,
      [id_cliente || null, id_sucursal || 1, total || 0, total_final || 0, estado || "PAGADO"]
    );

    const idVenta = ventaResult.insertId;

    // Insertar detalle de venta
    for (const p of carrito) {
      await conn.query(
        `INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_original, precio_vendido, subtotal)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [idVenta, p.id_producto, p.cantidad, p.precio, p.precio - (p.descuento || 0), p.subtotal]
      );
    }

    // Si es venta a crédito, insertar abono inicial
    if (esCredito && Number(abono_inicial) > 0) {
      await conn.query(
        `INSERT INTO abonos (id_venta, fecha, monto, metodo_pago, observaciones)
         VALUES (?, NOW(), ?, ?, ?)`,
        [idVenta, abono_inicial, metodo_pago || "efectivo", observaciones || ""]
      );
    }

    await conn.commit();
    res.json({ mensaje: "✅ Venta registrada correctamente", idVenta });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: "Error al registrar venta" });
  } finally {
    conn.release();
  }
};

/* =========================================================
   OBTENER VENTAS BÁSICAS
========================================================= */
export const obtenerVentas = async (req, res) => {
  try {
    const [ventas] = await pool.query(`
      SELECT v.id_venta, v.fecha, v.total_final, c.nombre AS cliente_nombre, v.estado
      FROM ventas v
      LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
      where c.activo = 'S' and v.estado  like '%pendiente%'
      ORDER BY v.id_venta DESC
    `);
    res.json(ventas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener ventas" });
  }
};

/* =========================================================
   OBTENER TODAS LAS VENTAS CON DETALLE
========================================================= */
export const obtenerVentasDetalle = async (req, res) => {
  try {
    const [ventas] = await pool.query(`
      SELECT
        v.id_venta,
        v.fecha,
        v.id_cliente,
        v.id_sucursal,
        v.total,
        v.total_final,
        v.estado,
        dv.id_producto,
        dv.cantidad,
        dv.precio_vendido,
        dv.subtotal,
        p.codigo,
        p.nombre,
        p.descripcion,
        p.precio_venta,
        p.precio_compra,
        p.imagen
      FROM ventas v
      JOIN detalle_venta dv ON v.id_venta = dv.id_venta
      JOIN productos p ON dv.id_producto = p.id_producto
      ORDER BY v.fecha DESC
    `);

    res.json(ventas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener ventas con detalle" });
  }
};

/* =========================================================
   OBTENER DETALLE DE UNA VENTA
========================================================= */
export const obtenerDetalleVenta = async (req, res) => {
  const { idVenta } = req.params;
  try {
    const [detalle] = await pool.query(
      `
      SELECT p.nombre, dv.cantidad, dv.precio_vendido, dv.subtotal
      FROM detalle_venta dv
      JOIN productos p ON dv.id_producto = p.id_producto
      WHERE dv.id_venta = ?
      `,
      [idVenta]
    );
    res.json(detalle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener detalle de venta" });
  }
};

/* =========================================================
   OBTENER ABONOS DE UNA VENTA
========================================================= */
export const obtenerAbonos = async (req, res) => {
  const { id_venta } = req.params;
  try {
    const [abonos] = await pool.query(
      `SELECT * FROM abonos WHERE id_venta = ? ORDER BY fecha ASC`,
      [id_venta]
    );
    res.json(abonos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener abonos" });
  }
};

/* =========================================================
   REGISTRAR UN NUEVO ABONO
========================================================= */
export const agregarAbono = async (req, res) => {
  const { id_venta, monto, metodo_pago, observaciones } = req.body;
  try {
    await pool.query(
      `INSERT INTO abonos (id_venta, fecha, monto, metodo_pago, observaciones)
       VALUES (?, NOW(), ?, ?, ?)`,
      [id_venta, monto, metodo_pago, observaciones || ""]
    );
    res.json({ mensaje: "Abono registrado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al registrar abono" });
  }
};

/* =========================================================
   EDITAR UNA VENTA
========================================================= */
export const editarVenta = async (req, res) => {
  const { idVenta } = req.params;
  const { total, total_final, estado, carrito } = req.body;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // Actualizar datos de la venta
    await conn.query(
      `UPDATE ventas SET total = ?, total_final = ?, estado = ? WHERE id_venta = ?`,
      [total, total_final, estado, idVenta]
    );

    // Si se envía un nuevo carrito, reemplazar detalle
    if (Array.isArray(carrito) && carrito.length > 0) {
      await conn.query(`DELETE FROM detalle_venta WHERE id_venta = ?`, [idVenta]);
      for (const p of carrito) {
        await conn.query(
          `INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_original, precio_vendido, subtotal)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [idVenta, p.id_producto, p.cantidad, p.precio, p.precio - (p.descuento || 0), p.subtotal]
        );
      }
    }

    await conn.commit();
    res.json({ mensaje: "✅ Venta actualizada correctamente" });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: "Error al editar venta" });
  } finally {
    conn.release();
  }
};

/* =========================================================
   ELIMINAR UNA VENTA
========================================================= */
export const eliminarVenta = async (req, res) => {
  const { idVenta } = req.params;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // Eliminar primero los abonos y detalle
    await conn.query(`DELETE FROM abonos WHERE id_venta = ?`, [idVenta]);
    await conn.query(`DELETE FROM detalle_venta WHERE id_venta = ?`, [idVenta]);

    // Luego la venta principal
    await conn.query(`DELETE FROM ventas WHERE id_venta = ?`, [idVenta]);

    await conn.commit();
    res.json({ mensaje: "🗑️ Venta eliminada correctamente" });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: "Error al eliminar venta" });
  } finally {
    conn.release();
  }
};

import { pool } from "../db.js";


export const registrarVenta = async (req, res) => {
  console.log(res);
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

    // 🔹 Determinar el estado de la venta
    const estadoVenta = esCredito ? "PENDIENTE" : "PAGADO";

    // 🔹 Insertar la venta principal
    const [ventaResult] = await conn.query(
      `INSERT INTO ventas (fecha, id_cliente, id_sucursal, total, total_final,metodo_pago, estado)
       VALUES (NOW(), ?, ?, ?, ?, ?, ?)`,
      [id_cliente || null, id_sucursal || 1, total || 0, total_final || 0, metodo_pago, estadoVenta]
    );

    const idVenta = ventaResult.insertId;

    // 🔹 Insertar los productos en detalle_venta (ya con campo descuento)
    for (const p of carrito) {
      const precioOriginal = Number(p.precio || 0);
      const descuento = Number(p.descuento || 0);
      const precioVendido = precioOriginal - descuento;
      const subtotal = precioVendido * Number(p.cantidad || 1);

      await conn.query(
        `INSERT INTO detalle_venta 
         (id_venta, id_producto, cantidad, precio_original, precio_vendido, descuento, subtotal)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [idVenta, p.id_producto, p.cantidad, precioOriginal, precioVendido, descuento, subtotal]
      );
    }

    // 🔹 Si es venta a crédito, registrar el abono inicial
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
    console.error("❌ Error al registrar venta:", err);
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
      SELECT 
      v.id_sucursal,
    v.id_venta,
    v.fecha,
    SUM(dv.cantidad) AS cantidad_total,
    v.total AS precio_venta_total,
    SUM((dv.precio_original - dv.precio_vendido) * dv.cantidad) AS descuento_total,
        v.total_final,
        v.estado
FROM ventas v
JOIN detalle_venta dv ON v.id_venta = dv.id_venta
Where v.activo = 'S'
GROUP BY v.id_venta, v.fecha, v.id_cliente, v.id_sucursal, v.total, v.total_final, v.estado
ORDER BY v.fecha DESC
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
      WHERE v.activo ='S'
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
     SELECT 
    v.id_venta,
    v.fecha,
    c.nombre AS cliente,
    v.metodo_pago,
    v.estado,
    IFNULL(SUM(a.monto), 0) AS total_abonado,
    p.nombre AS producto,
    dv.cantidad,
    dv.precio_vendido AS precio,
    dv.descuento,
    dv.subtotal
FROM ventas v
LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
LEFT JOIN abonos a ON v.id_venta = a.id_venta
JOIN detalle_venta dv ON v.id_venta = dv.id_venta
JOIN productos p ON dv.id_producto = p.id_producto
WHERE v.id_venta = ? AND v.activo = 'S'
GROUP BY 
    v.id_venta, v.fecha, c.nombre, v.metodo_pago, v.estado, 
    p.nombre, dv.cantidad, dv.precio_vendido, dv.descuento, dv.subtotal
ORDER BY v.fecha DESC

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
      `SELECT * FROM abonos WHERE id_venta = ? AND activo = 'S' ORDER BY fecha ASC`,
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

    // En lugar de eliminar, desactivamos la venta y sus detalles
    await conn.query(`UPDATE ventas SET activo = ? WHERE id_venta = ?`, ['N',idVenta]);
    await conn.query(`UPDATE detalle_venta SET activo = ? WHERE id_venta = ?`, ['N',idVenta]);
    await conn.query(`UPDATE abonos SET activo = ? WHERE id_venta = ?`, ['N',idVenta]);

    await conn.commit();
    res.json({ mensaje: "🟡 Venta desactivada correctamente" });
  } catch (err) {
    await conn.rollback();
    console.error("Error al desactivar venta:", err);
    res.status(500).json({ error: "Error al desactivar la venta" });
  } finally {
    conn.release();
  }
};


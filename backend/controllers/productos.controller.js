import { pool } from '../db.js';

// 🟢 Obtener todos los productos
export const getProductos = async (req, res) => {
  try {
    const { sucursal } = req.query;

    // 🔹 Consulta con JOIN correctos
    let query = `
      SELECT 
        p.id_producto,
        p.codigo,
        p.nombre,
        p.precio_venta,
        p.precio_compra,
        p.stock,
        p.id_sucursal,
        p.activo,
        p.imagen,
        c.nombre AS categoria,
        g.nombre AS genero
      FROM productos p
      LEFT JOIN categorias c ON c.id_categoria = p.id_categoria
      LEFT JOIN generos g ON g.id_genero = p.id_genero
      WHERE p.activo = 'S'`;

    const params = [];

    if (sucursal) {
      query += ' AND p.id_sucursal = ?';
      params.push(sucursal);
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('❌ Error al obtener productos:', err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};



// 🟡 Agregar producto (con multer)
export const agregarProductos = async (req, res) => {
  try {
    const codigo = req.body.codigo || 'PRD' + Date.now();
    const { nombre, precio_venta, precio_compra, stock } = req.body;

    // ✅ desde el frontend llegan como categoria, tipo y genero
    const id_categoria = req.body.categoria || null;
    const id_tipo = req.body.tipo || null;
    const id_genero = req.body.genero || null;

    // 🏪 Aceptar tanto "sucursal" como "id_sucursal" desde el frontend
    const id_sucursal = req.body.sucursal || req.body.id_sucursal || null;

    if (!id_sucursal) {
      return res.status(400).json({ error: 'Falta el id_sucursal o sucursal en la solicitud' });
    }

    const activo = req.body.activo || 'S';
    const imagen = req.file ? req.file.filename : null;

    const [result] = await pool.query(
      `INSERT INTO productos 
      (codigo, nombre, precio_venta, precio_compra, stock, id_sucursal, activo, imagen, id_categoria, id_genero)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [codigo, nombre, precio_venta, precio_compra, stock, id_sucursal, activo, imagen, id_categoria, id_genero]
    );

    res.json({ id_producto: result.insertId });
  } catch (err) {
    console.error('❌ Error al agregar producto:', err);
    res.status(500).json({ error: 'Error al agregar producto' });
  }
};


// 🟠 Actualizar producto
export const actualizarProductos = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      codigo,
      nombre,
      precio_venta,
      precio_compra,
      stock,
      categoria,
      genero,
      sucursal,
      id_sucursal,
    } = req.body;

    // 🏪 Aceptar tanto "sucursal" como "id_sucursal"
    const sucursalFinal = sucursal || id_sucursal || null;

    // 📸 Imagen (si se sube una nueva)
    const imagen = req.file ? req.file.filename : null;

    // 🔧 Armamos la consulta dinámica
    let query = `
      UPDATE productos
      SET codigo=?, nombre=?, precio_venta=?, precio_compra=?, stock=?`;

    const params = [
      codigo,
      nombre,
      precio_venta,
      precio_compra,
      stock,
    ];

    // Si hay categoría
    if (categoria) {
      query += ', id_categoria=?';
      params.push(categoria);
    }

    // Si hay género
    if (genero) {
      query += ', id_genero=?';
      params.push(genero);
    }

    // Si hay sucursal
    if (sucursalFinal) {
      query += ', id_sucursal=?';
      params.push(sucursalFinal);
    }

    // Si se envió nueva imagen
    if (imagen) {
      query += ', imagen=?';
      params.push(imagen);
    }

    query += ' WHERE id_producto=?';
    params.push(id);

    await pool.query(query, params);

    res.json({ message: '✅ Producto actualizado correctamente' });
  } catch (err) {
    console.error('❌ Error al actualizar producto:', err);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};


// 🔴 Eliminar producto
export const eliminarProductos = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`UPDATE productos 
       SET activo=?
       WHERE id_producto=?`,
      ["N", id]);
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};

import { pool } from '../db.js';

// 🟢 Obtener todos los productos
export const getProductos = async (req, res) => {
  try {
    const { sucursal } = req.query;
    let query = `
      SELECT 
        p.id_producto, p.codigo, p.nombre, p.precio_venta, p.precio_compra,
        p.stock, p.id_sucursal, p.activo, p.imagen,
        c.nombre AS categoria, p.id_genero AS genero
      FROM productos p
      INNER JOIN categorias c ON c.id_categoria = p.id_categoria
      WHERE p.activo='S'
    `;
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
const agregarProductos = async (req, res) => {
  try {
    const codigo = req.body.codigo || 'PRD' + Date.now();
    const { nombre, precio_venta, precio_compra, stock } = req.body;
    const id_categoria = req.body.categoria;
    const id_tipo = req.body.tipo;
    const id_genero = req.body.genero || null;
    const id_sucursal = req.body.id_sucursal || 1;
    const activo = req.body.activo || 'S';
    const imagen = req.file ? req.file.filename : null;

    const [result] = await pool.query(
      `INSERT INTO productos 
       (codigo, nombre, precio_venta, precio_compra, stock, id_sucursal, activo, imagen, id_categoria, id_genero)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [codigo, nombre, precio_venta, precio_compra, stock, id_sucursal, activo, imagen, id_categoria,  id_genero]
    );

    res.json({ id_producto: result.insertId });
  } catch (err) {
    console.error('❌ Error al agregar producto:', err);
    res.status(500).json({ error: 'Error al agregar producto' });
  }
};


// 🟠 Actualizar producto
const actualizarProductos = async (req, res) => {
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
const eliminarProductos = async (req, res) => {
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

// ✅ Exportar todo al final
export {
    agregarProductos,
  actualizarProductos,
  eliminarProductos
};


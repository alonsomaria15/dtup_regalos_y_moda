import { pool } from '../db.js';

// Obtener todos los clientes
export const getClientes = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clientes WHERE activo = "S"');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Agregar cliente
export const agregarCliente = async (req, res) => {
  const { nombre, telefono, direccion } = req.body;

  if (!nombre || !direccion) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO clientes (nombre, telefono, direccion) VALUES (?, ?, ?)',
      [nombre, telefono, direccion]
    );

    res.json({
      id_cliente: result.insertId,
      nombre,
      telefono,
      direccion
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const actualizarCliente = async (req, res) => {
  console.log("aqui");
  const { id } = req.params;
  const { nombre, telefono, direccion } = req.body;

  if (!nombre || !telefono || !direccion) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE clientes SET nombre = ?, telefono = ?, direccion = ? WHERE id_cliente = ?',
      [nombre, telefono, direccion, id]
    );

    res.json({ id_cliente: id, nombre, telefono, direccion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminarCliente = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query(
      'UPDATE clientes SET activo = ? WHERE id_cliente = ?',
      ['N', id] // <-- primero el valor 'N', luego el id
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Cliente no encontrado" });

    res.json({ mensaje: "Cliente marcado como inactivo correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


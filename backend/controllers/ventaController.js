import * as VentaModel from '../models/ventaModel.js';

export const registrarVenta = async (req, res) => {
  try {
    const { venta, detalles } = req.body;
    const id_venta = await VentaModel.crearVenta(venta, detalles);
    res.json({ mensaje: 'Venta registrada', id_venta });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar venta' });
  }
};

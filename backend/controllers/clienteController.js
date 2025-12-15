import * as ClienteModel from '../models/clienteModel.js';

export const crearCliente = async (req, res) => {
  try {
    const id_cliente = await ClienteModel.agregarCliente(req.body);
    res.json({ mensaje: 'Cliente agregado', id_cliente });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar cliente' });
  }
};

export const listarClientes = async (req, res) => {
  try {
    const clientes = await ClienteModel.obtenerClientes();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
};

import express from 'express';
import { crearCliente, listarClientes } from '../controllers/clienteController.js';
const router = express.Router();

router.post('/agregar', crearCliente);
router.get('/', listarClientes);

export default router;

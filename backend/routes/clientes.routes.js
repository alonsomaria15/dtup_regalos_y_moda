import { Router } from 'express';
import { getClientes, agregarCliente, actualizarCliente ,eliminarCliente} from '../controllers/clientes.controller.js';

const router = Router();

router.get('/', getClientes);       // GET /api/clientes
router.post('/', agregarCliente);   // POST /api/clientes

// PUT /api/clientes/:id
router.put('/:id', actualizarCliente); //Editar Cliente
router.delete('/:id', eliminarCliente); // DELETE /api/clientes/:id

export default router;

import express from 'express';
import { getProductos, agregarProductos, actualizarProductos, eliminarProductos } from '../controllers/productos.controller.js';
import { upload } from '../middlewares/multer.js'; // tu multer configurado
import { getSucursales } from '../controllers/sucursales.controller.js';

const router = express.Router();

router.get('/', getProductos);

// Aplicar multer al POST
router.post('/agregar', upload.single('imagen'), agregarProductos);

router.put('/:id', upload.single('imagen'), actualizarProductos);
router.delete('/:id', eliminarProductos);

router.get('/', getSucursales);

export default router;

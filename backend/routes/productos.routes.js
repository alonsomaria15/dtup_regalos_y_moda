import express from 'express';
import { getProductos, agregarProductos, actualizarProductos, eliminarProductos } from '../controllers/productos.controller.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.get('/', getProductos);

// Aplicar multer para manejar la imagen
router.post('/agregar', upload.single('imagen'), agregarProductos);
router.put('/:id', upload.single('imagen'), actualizarProductos);
router.delete('/:id', eliminarProductos);

export default router;

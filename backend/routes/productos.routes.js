import express from 'express';
import {
  getProductos,
  agregarProductos,
  actualizarProductos,
  eliminarProductos,
} from '../controllers/productos.controller.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

// 🔹 Obtener productos (por sucursal si se envía ?sucursal=)
router.get('/', getProductos);

// 🔹 Agregar producto (con imagen)
router.post('/agregar', upload.single('imagen'), agregarProductos);

// 🔹 Actualizar producto
router.put('/:id', upload.single('imagen'), actualizarProductos);

// 🔹 Desactivar producto
router.delete('/:id', eliminarProductos);

router.get('/', getSucursales);

export default router;

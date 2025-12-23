import express from 'express';
import { obtenerTiposProducto } from '../controllers/tipos.controller.js';

const router = express.Router();

// Obtener tipos de producto filtrados por categoría
router.get('/', obtenerTiposProducto);

export default router;

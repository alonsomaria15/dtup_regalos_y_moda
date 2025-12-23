import express from 'express';
import { obtenerCategorias } from '../controllers/categorias.controller.js';

const router = express.Router();

router.get('/', obtenerCategorias);

export default router;

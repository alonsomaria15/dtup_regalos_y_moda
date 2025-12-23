import express from 'express';
import { obtenerGenero } from '../controllers/genero.controller.js';

const router = express.Router();

router.get('/', obtenerGenero);

export default router;

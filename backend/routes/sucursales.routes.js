// backend/routes/sucursales.routes.js
import express from 'express';
import { getSucursales } from '../controllers/sucursales.controller.js';

const router = express.Router();

// GET /api/sucursales -> obtener todas las sucursales activas
router.get('/', getSucursales);

export default router;

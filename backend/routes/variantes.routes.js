// routes/variantes.js
import express from "express";
import { agregarVariantes, obtenerVariantesPorProducto } from "../controllers/variantes.controller.js";

const router = express.Router();

router.post("/", agregarVariantes);
router.get("/:id", obtenerVariantesPorProducto); // ✅ nueva ruta GET

export default router;

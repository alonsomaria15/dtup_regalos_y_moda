import express from "express";
import { agregarAbono, obtenerAbonosPorVenta } from "../controllers/abonos.controller.js";

const router = express.Router();

router.post("/agregar", agregarAbono);
router.get("/:id_venta", obtenerAbonosPorVenta);

export default router;

import express from "express";
import {
  registrarVenta,
  obtenerVentas,
  obtenerVentasDetalle,
  obtenerDetalleVenta,
  obtenerAbonos,
  agregarAbono,
  editarVenta,
  eliminarVenta,
} from "../controllers/ventas.controller.js";

const router = express.Router();

// Obtener todas las ventas (resumen)
router.get("/", obtenerVentas);

// Obtener ventas con detalle completo
router.get("/detalle", obtenerVentasDetalle);

// Obtener detalle de una venta específica
router.get("/detalle/:idVenta", obtenerDetalleVenta);

// Registrar una nueva venta
router.post("/agregar", registrarVenta);

// Obtener abonos de una venta
router.get("/abonos/:id_venta", obtenerAbonos);

// Agregar un nuevo abono
router.post("/abonos", agregarAbono);

// Editar una venta existente
router.put("/:idVenta", editarVenta);

// Eliminar una venta
router.delete("/:idVenta", eliminarVenta);

export default router;

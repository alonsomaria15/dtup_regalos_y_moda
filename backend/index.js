import express from "express";
import cors from "cors";
import path from "path";               // ✅ necesario
import { fileURLToPath } from "url";   // ✅ necesario para usar __dirname

// 🔹 Importa tus rutas
import ventasRoutes from "./routes/ventas.routes.js";
import abonosRoutes from "./routes/abonos.routes.js";
import clientesRoutes from "./routes/clientes.routes.js";
import productosRoutes from "./routes/productos.routes.js";
import categoriasRoutes from "./routes/categorias.routes.js";
import generoRoutes from "./routes/genero.routes.js";
import tiposRoutes from "./routes/tipos.routes.js";
import variantesRoutes from "./routes/variantes.routes.js";


const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Configurar __dirname en entorno de módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Montar todas las rutas de la API
app.use("/api/ventas", ventasRoutes);
app.use("/api/abonos", abonosRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/genero", generoRoutes);
app.use("/api/tipos", tiposRoutes);
app.use("/api/variantes", variantesRoutes);

// ✅ Servir la carpeta "uploads" de forma estática
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(3001, () => {
  console.log("✅ Servidor corriendo en http://localhost:3001");
});

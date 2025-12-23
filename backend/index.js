import express from "express";
import cors from "cors";
import ventasRoutes from "./routes/ventas.routes.js";
import abonosRoutes from "./routes/abonos.routes.js";
import clientesRoutes from "./routes/clientes.routes.js";
import productosRoutes from "./routes/productos.routes.js";
import categoriasRoutes from "./routes/categorias.routes.js"; // ✅ asegúrate que exista
import generoRoutes from "./routes/genero.routes.js";
import tiposRoutes from './routes/tipos.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Monta todas las rutas
app.use("/api/ventas", ventasRoutes);
app.use("/api/abonos", abonosRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/categorias", categoriasRoutes); // ✅ importante
app.use("/api/genero", generoRoutes);
app.use("/api/tipos", tiposRoutes);


app.listen(3001, () => {
  console.log("✅ Servidor corriendo en http://localhost:3001");
});

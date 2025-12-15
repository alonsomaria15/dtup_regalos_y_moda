import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import productosRouter from './routes/productos.js';
import clientesRouter from './routes/clientes.js';
import ventasRouter from './routes/ventas.js';

const app = express();
app.use(cors());
app.use(express.json());

// =======================
// Esto reemplaza __dirname
// =======================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carpeta para servir imágenes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =======================
// Rutas
// =======================
app.use('/api/productos', productosRouter);
app.use('/api/clientes', clientesRouter);
app.use('/api/ventas', ventasRouter);

// =======================
// Iniciar servidor
// =======================
app.listen(3001, () => console.log('Servidor corriendo en http://localhost:3001'));

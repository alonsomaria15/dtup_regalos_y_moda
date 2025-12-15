import express from 'express';
import multer from 'multer';
import { agregarProducto } from '../controllers/productosController.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.post('/agregar', upload.single('imagen'), agregarProducto);

export default router;

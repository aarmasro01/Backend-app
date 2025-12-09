import express from 'express';
import multer from 'multer';
import { productController } from '../Controllers/productController.js';

// Usar memoria en lugar de disco (buffer)
const upload = multer({ storage: multer.memoryStorage() });

export class ProductRoutes {
  constructor() {
    this.router = express.Router();
    this.init();
  }

  init() {
    this.router.get('/', (req, res) => productController.obtenerProductos(req, res));
    this.router.post('/create', upload.single('imagenProducto'), (req, res) => productController.crearProducto(req, res));
    this.router.get('/:id', (req, res) => productController.obtenerProductoPorId(req, res));
    this.router.put('/:id', upload.single('imagenProducto'), (req, res) => productController.actualizarProducto(req, res));
    this.router.put('/:id/estado', (req, res) => productController.actualizarEstadoProducto(req, res));
    this.router.delete('/:id', (req, res) => productController.eliminarProducto(req, res));
  }

  getRouter() {
    return this.router;
  }
}

export default new ProductRoutes();

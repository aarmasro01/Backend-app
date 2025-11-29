import express from 'express';
import multer from 'multer';
import { pagoController } from '../Controllers/pagoController.js';

// Usar memoria en lugar de disco (buffer)
const upload = multer({ storage: multer.memoryStorage() });


export class PagoRoutes {
  constructor() {
    this.router = express.Router();
    this.init();
  }

  init() {
    this.router.post('/register', upload.single('comprobantePago'), (req, res) => pagoController.agregarPago(req, res));
    this.router.get('/ultimo', (req, res) => pagoController.obtenerIdUltimoPago(req, res));
    this.router.get('/', pagoController.listar);
    this.router.get('/:id', (req, res) => pagoController.obtenerPorId(req, res));
  }

  getRouter() {
    return this.router;
  }
}

export default new PagoRoutes().getRouter();
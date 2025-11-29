import express from 'express';
import { detallePedidoController } from '../Controllers/detallePedidoController.js';

export class DetallePedidoRoutes {
  constructor() {
    this.router = express.Router();
    this.init();
  }

  init() {
    this.router.post('/register', (req, res) => detallePedidoController.agregarDetallePedido(req, res));
    this.router.get('/pedido/:idPedido', (req, res) => detallePedidoController.obtenerDetallesPedidoId(req, res));
  }

  getRouter() {
    return this.router;
  }
}

export default new DetallePedidoRoutes().getRouter();

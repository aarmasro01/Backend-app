import express from 'express';
import { pedidoController } from '../Controllers/pedidoController.js';

export class PedidoRoutes {
  constructor() {
    this.router = express.Router();
    this.init();
  }

  init() {
    this.router.post('/register', (req, res) => pedidoController.agregarPedido(req, res));
    this.router.get('/ultimo', (req, res) => pedidoController.obtenerIdUltimoPedido(req, res));
    this.router.get('/all', (req, res) => pedidoController.obtenerPedidos(req, res));
    this.router.get('/:id', (req, res) => pedidoController.obtenerPedidoPorId(req, res));
    this.router.put('/:id/estado', (req, res) => pedidoController.actualizarEstado(req, res));
    this.router.get('/user/:idUsuario', (req, res) => pedidoController.obtenerPedidosPorUsuario(req, res));

  }

  getRouter() {
    return this.router;
  }
}

export default new PedidoRoutes().getRouter();

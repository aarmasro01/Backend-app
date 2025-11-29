import express from 'express';
import { clienteController } from '../Controllers/clienteController.js';

export class ClienteRoutes {
  constructor() {
    this.router = express.Router();
    this.init();
  }

  init() {
    this.router.get('/usuario/:idUsuario', (req, res) => clienteController.obtenerIdClienteUsuario(req, res));
    this.router.post('/register', (req, res) => clienteController.agregarCliente(req, res));
  }

  getRouter() {
    return this.router;
  }
}

export default new ClienteRoutes().getRouter();

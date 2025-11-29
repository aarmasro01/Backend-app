import express from 'express';
import { reclamoController } from '../Controllers/reclamoController.js';

export class ReclamoRoutes {
  constructor() {
    this.router = express.Router();
    this.init();
  }

  init() {
    // Crear un nuevo reclamo
    this.router.post('/register', (req, res) => reclamoController.crearReclamo(req, res));
    
    // Obtener todos los reclamos
    this.router.get('/obtener', (req, res) => reclamoController.obtenerReclamos(req, res));
    
    // Obtener reclamos por cliente
    this.router.get('/usuario/:idUsuario', (req, res) => reclamoController.obtenerReclamosPorUsuario(req, res));
    
    // Obtener un reclamo específico por ID
    this.router.get('/:id', (req, res) => reclamoController.obtenerReclamoPorId(req, res));
  }

  getRouter() {
    return this.router;
  }
}

export default new ReclamoRoutes().getRouter();

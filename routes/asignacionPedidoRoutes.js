import { Router } from 'express';
import { AsignacionPedidoController } from '../Controllers/asignacionPedidoController.js';

const router = Router();

// GET /asignaciones
router.get('/', AsignacionPedidoController.obtenerTodos);

// GET /asignaciones/pedido/:idPedido
router.get('/pedido/:idPedido', AsignacionPedidoController.obtenerPorIdPedido);

// POST /asignaciones
router.post('/', AsignacionPedidoController.agregar);

// PUT /asignaciones/repartidor/:idRepartidor
router.put('/:idAsignacion/repartidor', AsignacionPedidoController.actualizarRepartidor);

router.get('/repartidor/:idRepartidor', AsignacionPedidoController.obtenerPorIdRepartidor);

export default router;

import { Router } from 'express';
import { EstadoPedidoController } from '../Controllers/EstadoPedidoController.js';

const router = Router();

// GET /estado-pedido
router.get('/', EstadoPedidoController.listar);

// GET /estado-pedido/:id
router.get('/:id', EstadoPedidoController.obtener);

// POST /estado-pedido
router.post('/', EstadoPedidoController.crear);

// PUT /estado-pedido/:id
router.put('/:id', EstadoPedidoController.actualizar);

// DELETE /estado-pedido/:id
router.delete('/:id', EstadoPedidoController.eliminar);

export default router;
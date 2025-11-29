import { Router } from 'express';
import { RepartidorController } from '../Controllers/repartidorController.js';

const router = Router();

router.get('/', RepartidorController.listar);
router.get('/:id', RepartidorController.obtener);
router.post('/', RepartidorController.crear);
router.put('/:id', RepartidorController.actualizar);
router.delete('/:id', RepartidorController.eliminar);

export default router;

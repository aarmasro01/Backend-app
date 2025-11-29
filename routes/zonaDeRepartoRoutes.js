import { Router } from 'express';
import { ZonaDeRepartoController } from '../Controllers/zonaDeRepartoController.js';

const router = Router();

router.get('/', ZonaDeRepartoController.listar);

router.get('/:id', ZonaDeRepartoController.obtener);

router.post('/', ZonaDeRepartoController.crear);

router.put('/:id', ZonaDeRepartoController.actualizar);

router.delete('/:id', ZonaDeRepartoController.eliminar);

export default router;

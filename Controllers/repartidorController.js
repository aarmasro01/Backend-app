import { RepartidorModel } from '../Models/Repartidor.js';

function validarBody(body) {
  const { idUsuario, nombreCompleto, correo, telefono } = body;

  if (idUsuario === undefined || idUsuario === null || isNaN(Number(idUsuario)))
    return 'idUsuario debe ser numérico';

  if (!nombreCompleto || typeof nombreCompleto !== 'string')
    return 'nombreCompleto es obligatorio';

  if (!correo || typeof correo !== 'string')
    return 'correo es obligatorio';

  if (!telefono || typeof telefono !== 'string')
    return 'telefono es obligatorio';

  return null;
}

export class RepartidorController {

  static async crear(req, res, next) {
    try {
      const error = validarBody(req.body);
      if (error) return res.status(400).json({ message: error });

      const payload = {
        idUsuario: Number(req.body.idUsuario),
        nombreCompleto: req.body.nombreCompleto.trim(),
        correo: req.body.correo.trim(),
        telefono: req.body.telefono.trim()
      };

      const id = await RepartidorModel.crear(payload);
      return res.status(201).json({ idRepartidor: id, ...payload });

    } catch (err) {
      next(err);
    }
  }

  static async listar(req, res, next) {
    try {
      const data = await RepartidorModel.obtenerTodos();
      return res.json(data);

    } catch (err) {
      next(err);
    }
  }

  static async obtener(req, res, next) {
    try {
      const id = Number(req.params.id);
      const rep = await RepartidorModel.obtenerPorId(id);

      if (!rep) return res.status(404).json({ message: 'Repartidor no encontrado' });

      return res.json(rep);

    } catch (err) {
      next(err);
    }
  }

  static async actualizar(req, res, next) {
    try {
      const id = Number(req.params.id);
      const error = validarBody(req.body);

      if (error) return res.status(400).json({ message: error });

      const payload = {
        idUsuario: Number(req.body.idUsuario),
        nombreCompleto: req.body.nombreCompleto.trim(),
        correo: req.body.correo.trim(),
        telefono: req.body.telefono.trim()
      };

      const ok = await RepartidorModel.actualizar(id, payload);

      if (!ok) return res.status(404).json({ message: 'Repartidor no encontrado' });

      return res.json({ idRepartidor: id, ...payload });

    } catch (err) {
      next(err);
    }
  }

  static async eliminar(req, res, next) {
    try {
      const id = Number(req.params.id);
      const ok = await RepartidorModel.eliminar(id);

      if (!ok) return res.status(404).json({ message: 'Repartidor no encontrado' });

      return res.status(204).send();

    } catch (err) {
      next(err);
    }
  }

}

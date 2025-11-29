import { AsignacionPedidoModel } from '../Models/AsignacionPedido.js';

const ESTADOS = new Set(['Asignado', 'En camino', 'Entregado', 'Cancelado']);

function validarCrear(body) {
  const { idPedido, idRepartidor, fechaAsignacion, horaAsignacion, estadoAsignacion } = body;

  if (idPedido === undefined || isNaN(Number(idPedido))) return 'idPedido debe ser numérico';
  if (idRepartidor === undefined || isNaN(Number(idRepartidor))) return 'idRepartidor debe ser numérico';
  if (!fechaAsignacion) return 'fechaAsignacion es obligatoria (YYYY-MM-DD)';
  if (!horaAsignacion) return 'horaAsignacion es obligatoria (HH:MM:SS)';
  if (!estadoAsignacion || !ESTADOS.has(estadoAsignacion))
    return "estadoAsignacion inválido. Valores: 'Asignado','En camino','Entregado','Cancelado'";

  return null;
}


export class AsignacionPedidoController {

  static async agregar(req, res, next) {
    try {
      const error = validarCrear(req.body);
      if (error) return res.status(400).json({ message: error });

      const payload = {
        idPedido: Number(req.body.idPedido),
        idRepartidor: Number(req.body.idRepartidor),
        fechaAsignacion: req.body.fechaAsignacion,
        horaAsignacion: req.body.horaAsignacion,
        estadoAsignacion: req.body.estadoAsignacion
      };

      const id = await AsignacionPedidoModel.agregar(payload);
      return res.status(201).json({ idAsignacion: id, ...payload });

    } catch (err) {
      next(err);
    }
  }

  static async actualizarRepartidor(req, res, next) {
  try {
    const idAsignacion = Number(req.params.idAsignacion);
    const { idRepartidor } = req.body;

    if (isNaN(idAsignacion)) {
      return res.status(400).json({ message: 'idAsignacion inválido' });
    }

    if (idRepartidor === undefined || isNaN(Number(idRepartidor))) {
      return res.status(400).json({ message: 'idRepartidor debe ser numérico' });
    }

    const ok = await AsignacionPedidoModel.actualizarRepartidor(
      idAsignacion,
      Number(idRepartidor)
    );

    if (!ok) {
      return res.status(404).json({ message: 'Asignación no encontrada' });
    }

    return res.json({
      message: 'Repartidor actualizado',
      idAsignacion,
      idRepartidor: Number(idRepartidor)
    });
  } catch (err) {
    next(err);
  }
}


  static async obtenerTodos(req, res, next) {
    try {
      const data = await AsignacionPedidoModel.obtenerTodos();
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }

  static async obtenerPorIdPedido(req, res, next) {
    try {
      const idPedido = Number(req.params.idPedido);
      if (isNaN(idPedido)) return res.status(400).json({ message: 'idPedido inválido' });

      const rows = await AsignacionPedidoModel.obtenerPorIdPedido(idPedido);
      return res.json(rows);

    } catch (err) {
      next(err);
    }
  }

  static async obtenerPorIdRepartidor(req, res, next) {
    try {
      const idRepartidor = Number(req.params.idRepartidor);
      if (isNaN(idRepartidor)) return res.status(400).json({ message: 'idRepartidor inválido' });

      const rows = await AsignacionPedidoModel.obtenerPorIdRepartidor(idRepartidor);
      return res.json(rows);

    } catch (err) {
      next(err);
    }
  }
}

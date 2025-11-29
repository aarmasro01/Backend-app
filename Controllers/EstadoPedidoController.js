import { EstadoPedidoModel } from '../Models/EstadoPedido.js';

export class EstadoPedidoController {
  static async crear(req, res, next) {
    try {
      const { nombreEstadoPedido } = req.body;
      if (!nombreEstadoPedido || typeof nombreEstadoPedido !== 'string') {
        return res.status(400).json({ message: 'nombreEstadoPedido es obligatorio' });
      }
      const id = await EstadoPedidoModel.agregarEstado(nombreEstadoPedido.trim());
      return res.status(201).json({ idEstadoPedido: id, nombreEstadoPedido: nombreEstadoPedido.trim() });
    } catch (err) {
      next(err);
    }
  }

  static async listar(req, res, next) {
    try {
      const estados = await EstadoPedidoModel.obtenerTodos();
      return res.json(estados);
    } catch (err) {
      next(err);
    }
  }

  static async obtener(req, res, next) {
    try {
      const { id } = req.params;
      const estado = await EstadoPedidoModel.obtenerPorId(Number(id));
      if (!estado) {
        return res.status(404).json({ message: 'EstadoPedido no encontrado' });
      }
      return res.json(estado);
    } catch (err) {
      next(err);
    }
  }

  static async actualizar(req, res, next) {
    try {
      const { id } = req.params;
      const { nombreEstadoPedido } = req.body;
      if (!nombreEstadoPedido || typeof nombreEstadoPedido !== 'string') {
        return res.status(400).json({ message: 'nombreEstadoPedido es obligatorio' });
      }
      const ok = await EstadoPedidoModel.actualizar(Number(id), nombreEstadoPedido.trim());
      if (!ok) {
        return res.status(404).json({ message: 'EstadoPedido no encontrado' });
      }
      return res.json({ idEstadoPedido: Number(id), nombreEstadoPedido: nombreEstadoPedido.trim() });
    } catch (err) {
      next(err);
    }
  }

  static async eliminar(req, res, next) {
    try {
      const { id } = req.params;
      const ok = await EstadoPedidoModel.eliminar(Number(id));
      if (!ok) {
        return res.status(404).json({ message: 'EstadoPedido no encontrado' });
      }
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
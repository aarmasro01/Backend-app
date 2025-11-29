import { DetallePedidoModel } from '../Models/DetallePedido.js';

class DetallePedidoController {
  async agregarDetallePedido(req, res) {
    try {
      const requerido = ['idPedido', 'idProducto', 'precioUnitario', 'cantidad', 'subtotal'];
      const faltantes = requerido.filter((campo) => req.body[campo] === undefined || req.body[campo] === null);
      if (faltantes.length) return res.status(400).json({ error: `Faltan campos: ${faltantes.join(', ')}` });

      const idDetallePedido = await DetallePedidoModel.agregarDetallePedido(req.body);
      res.status(201).json({ message: 'Detalle registrado', idDetallePedido });
    } catch (error) {
      console.error('DetallePedidoController.agregarDetallePedido error:', error);
      res.status(500).json({ error: 'No se pudo registrar el detalle' });
    }
  }

  async obtenerDetallesPedidoId(req, res) {
    try {
      const { idPedido } = req.params;
      const detalles = await DetallePedidoModel.obtenerDetallesPedidoId(idPedido);
      res.json({ detalles });
    } catch (error) {
      console.error('DetallePedidoController.obtenerDetallesPedidoId error:', error);
      res.status(500).json({ error: 'No se pudieron obtener los detalles' });
    }
  }
}

export const detallePedidoController = new DetallePedidoController();

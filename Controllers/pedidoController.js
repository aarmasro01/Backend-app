import { PedidoModel } from '../Models/Pedido.js';

class PedidoController {
  async agregarPedido(req, res) {
    try {
      const requerido = ['idUsuario','idCliente', 'nombreReceptor', 'apellidosReceptor', 'correoReceptor', 'telefonoReceptor', 'direccionEntrega', 'fecha', 'hora', 'idEstadoPedido', 'tipoComprobantePago', 'idPago'];
      const faltantes = requerido.filter((campo) => req.body[campo] === undefined || req.body[campo] === null);
      if (faltantes.length) return res.status(400).json({ error: `Faltan campos: ${faltantes.join(', ')}` });

      const idPedido = await PedidoModel.agregarPedido(req.body);
      res.status(201).json({ message: 'Pedido registrado', idPedido });
    } catch (error) {
      console.error('PedidoController.agregarPedido error:', error);
      res.status(500).json({ error: 'No se pudo registrar el pedido' });
    }
  }

  async obtenerIdUltimoPedido(req, res) {
    try {
      const idPedido = await PedidoModel.obtenerIdUltimoPedido();
      res.json({ idPedido });
    } catch (error) {
      console.error('PedidoController.obtenerIdUltimoPedido error:', error);
      res.status(500).json({ error: 'No se pudo obtener el último pedido' });
    }
  }

  async obtenerPedidos(req, res) {
    try {
      const pedidos = await PedidoModel.obtenerTodos();
      res.json(pedidos);
    } catch (error) {
      console.error('PedidoController.obtenerPedidos error:', error);
      res.status(500).json({ error: 'No se pudieron obtener los pedidos' });
    }
  }

  async obtenerPedidoPorId(req, res) {
    try {
      const { id } = req.params;
      const pedido = await PedidoModel.obtenerPorId(id);

      if (!pedido) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }

      res.json(pedido);
    } catch (error) {
      console.error('PedidoController.obtenerPedidoPorId error:', error);
      res.status(500).json({ error: 'No se pudo obtener el pedido' });
    }
  }

  async actualizarEstado(req, res) {
    try {
      const { id } = req.params;
      const { idEstadoPedido } = req.body;

      if (!idEstadoPedido) {
        return res.status(400).json({ error: 'El campo idEstadoPedido es obligatorio' });
      }

      const actualizado = await PedidoModel.actualizarEstado(id, idEstadoPedido);
      if (!actualizado) return res.status(404).json({ error: 'Pedido no encontrado o sin cambios' });

      res.json({ message: 'Estado del pedido actualizado correctamente' });
    } catch (error) {
      console.error('PedidoController.actualizarEstado error:', error);
      res.status(500).json({ error: 'No se pudo actualizar el estado del pedido' });
    }
  }

  async obtenerPedidosPorUsuario(req, res) {
  try {
    const { idUsuario } = req.params;

    const pedidos = await PedidoModel.obtenerPorUsuario(idUsuario);

    if (!pedidos.length) {
      return res.status(404).json({ message: 'No hay pedidos para este usuario' });
    }

    res.json(pedidos);
  } catch (error) {
    console.error('PedidoController.obtenerPedidosPorUsuario error:', error);
    res.status(500).json({ error: 'No se pudieron obtener los pedidos del usuario' });
  }
}


}

export const pedidoController = new PedidoController();
export default pedidoController;

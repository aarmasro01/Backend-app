import { ClienteModel } from '../Models/Cliente.js';


class ClienteController {
  async obtenerIdClienteUsuario(req, res) {
    try {
      const { idUsuario } = req.params;
      const cliente = await ClienteModel.obtenerIdClienteUsuario(idUsuario);
      if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
      res.json({ idCliente: cliente.idCliente, cliente });
    } catch (error) {
      console.error('ClienteController.obtenerIdClienteUsuario error:', error);
      res.status(500).json({ error: 'No se pudo obtener el cliente' });
    }
  }

  async agregarCliente(req, res) {
    try {
      const { idUsuario, nombreCompleto, correo, telefono } = req.body;
      if (!idUsuario || !nombreCompleto || !correo || !telefono) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
      }

      const nuevoCliente = await ClienteModel.agregarCliente({
        idUsuario,
        nombreCompleto,
        correo,
        telefono
      });

      res.status(201).json({ mensaje: 'Cliente registrado exitosamente', cliente: nuevoCliente });
    } catch (error) {
      console.error('ClienteController.agregarCliente error:', error);
      res.status(500).json({ error: 'No se pudo registrar el cliente' });
    }
  }
}

export const clienteController = new ClienteController();

import { ReclamoModel } from '../Models/Reclamo.js';

class ReclamoController {
  async crearReclamo(req, res) {
    try {
      const {
        idUsuario,
        nombreCompleto,
        correo,
        telefono,
        tipoDocumento,
        numDocumento,
        departamento,
        provincia,
        distrito,
        direccion,
        montoReclamo,
        numPedido,
        fechaPedido,
        tipoSolicitud,
        detalles
      } = req.body;

      if (!nombreCompleto || !correo) {
        return res.status(400).json({ error: 'nombreCompleto y correo son obligatorios.' });
      }

      const idReclamo = await ReclamoModel.create({
        idUsuario,
        nombreCompleto,
        correo,
        telefono,
        tipoDocumento,
        numDocumento,
        departamento,
        provincia,
        distrito,
        direccion,
        montoReclamo,
        numPedido,
        fechaPedido,
        tipoSolicitud,
        detalles
      });

      res.status(201).json({ 
        message: 'Reclamo creado correctamente.', 
        idReclamo 
      });
    } catch (error) {
      console.error('ReclamoController.crearReclamo error:', error);
      res.status(500).json({ error: 'No se pudo crear el reclamo.' });
    }
  }

  async obtenerReclamos(req, res) {
    try {
      const reclamos = await ReclamoModel.findAll();
      res.json({ reclamos });
    } catch (error) {
      console.error('ReclamoController.obtenerReclamos error:', error);
      res.status(500).json({ error: 'No se pudieron obtener los reclamos.' });
    }
  }

  async obtenerReclamosPorUsuario(req, res) {
    try {
      const { idUsuario } = req.params;
      if (!idUsuario) {
        return res.status(400).json({ error: 'idUsuario es obligatorio.' });
      }

      const reclamos = await ReclamoModel.findByUsuario(idUsuario);
      res.json({ reclamos });
    } catch (error) {
      console.error('ReclamoController.obtenerReclamosPorUsuario error:', error);
      res.status(500).json({ error: 'No se pudieron obtener los reclamos del usuario.' });
    }
  }

  async obtenerReclamoPorId(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'ID del reclamo es obligatorio.' });
      }

      const reclamo = await ReclamoModel.findById(id);
      if (!reclamo) {
        return res.status(404).json({ error: 'Reclamo no encontrado.' });
      }

      res.json({ reclamo });
    } catch (error) {
      console.error('ReclamoController.obtenerReclamoPorId error:', error);
      res.status(500).json({ error: 'No se pudo obtener el reclamo.' });
    }
  }
}

export const reclamoController = new ReclamoController();

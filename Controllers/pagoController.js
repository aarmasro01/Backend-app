import { PagoModel } from '../Models/Pago.js';
import { uploadToGCS } from '../config/cloudStorage.js';

class PagoController {
  async agregarPago(req, res) {
    try {
      const { metodoPago, fechaPago, montoPago } = req.body;

      // Validaciones
      if (!metodoPago) {
        return res.status(400).json({ error: 'metodoPago es obligatorio' });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'comprobantePago es obligatorio' });
      }

      if (montoPago === undefined || montoPago === null || isNaN(parseFloat(montoPago))) {
        return res.status(400).json({
          error: 'montoPago es obligatorio y debe ser numérico',
        });
      }

      // Subir comprobante a Google Cloud Storage
      const comprobantePago = await uploadToGCS(req.file, 'comprobantes');

      const idPago = await PagoModel.agregarPago({
        metodoPago,
        comprobantePago,
        fechaPago,
        montoPago: parseFloat(montoPago),
      });

      res.status(201).json({
        message: 'Pago registrado',
        idPago,
        archivo: comprobantePago,
      });

    } catch (error) {
      console.error('PagoController.agregarPago error:', error);
      res.status(500).json({
        error: 'No se pudo registrar el pago',
      });
    }
  }

  async obtenerIdUltimoPago(req, res) {
    try {
      const idPago = await PagoModel.obtenerIdUltimoPago();
      res.json({ idPago });
    } catch (error) {
      console.error('PagoController.obtenerIdUltimoPago error:', error);
      res.status(500).json({ error: 'No se pudo obtener el último pago' });
    }
  }

  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const pago = await PagoModel.obtenerPorId(id);

      if (!pago) {
        return res.status(404).json({ error: 'Pago no encontrado' });
      }

      return res.json(pago);

    } catch (error) {
      console.error('PagoController.obtenerPorId error:', error);
      res.status(500).json({ error: 'No se pudo obtener el pago' });
    }
  }

  async listar(req, res, next) {
    try {
      const pagos = await PagoModel.obtenerTodos();
      return res.json(pagos);
    } catch (err) {
      next(err);
    }
  }
}

export const pagoController = new PagoController();
export default pagoController;

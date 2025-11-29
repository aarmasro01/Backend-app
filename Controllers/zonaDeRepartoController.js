import { ZonaDeRepartoModel } from '../Models/ZonaDeReparto.js';

function validarBody(body) {
  const { distrito, costoEnvio } = body;

  if (!distrito || typeof distrito !== 'string') return 'distrito es obligatorio';

  if (costoEnvio === undefined || costoEnvio === null || isNaN(Number(costoEnvio))) {
    return 'costoEnvio debe ser numérico';
  }

  return null;
}

export class ZonaDeRepartoController {
  static async crear(req, res, next) {
    try {
      const error = validarBody(req.body);
      if (error) return res.status(400).json({ message: error });

      const payload = {
        distrito: req.body.distrito.trim(),
        costoEnvio: Number(req.body.costoEnvio),
      };

      const id = await ZonaDeRepartoModel.crear(payload);
      return res.status(201).json({
        message: 'Zona registrada correctamente',
        idZona: id,
        ...payload
      });
    } catch (err) {
      next(err);
      res.status(500).json({ error: 'Error al registrar zona' });
    }
  }

  static async listar(req, res, next) {
    try {
      const data = await ZonaDeRepartoModel.obtenerTodos();
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }

  static async obtener(req, res, next) {
    try {
      const idZona = Number(req.params.id);
      if (isNaN(idZona)) return res.status(400).json({ message: 'idZona inválido' });

      const zona = await ZonaDeRepartoModel.obtenerPorId(idZona);
      if (!zona) return res.status(404).json({ message: 'Zona de reparto no encontrada' });

      return res.json(zona);
    } catch (err) {
      next(err);
    }
  }

  static async actualizar(req, res, next) {
    try {
      const idZona = Number(req.params.id);
      if (isNaN(idZona)) return res.status(400).json({ message: 'idZona inválido' });

      const error = validarBody(req.body);
      if (error) return res.status(400).json({ message: error });

      const payload = {
        distrito: req.body.distrito.trim(),
        costoEnvio: Number(req.body.costoEnvio),
      };

      const ok = await ZonaDeRepartoModel.actualizar(idZona, payload);
      if (!ok) return res.status(404).json({ message: 'Zona de reparto no encontrada' });

      return res.json({
      message: 'Zona actualizada correctamente',
      idZona,
      ...payload
    });
    } catch (err) {
      next(err);
    }
  }

  static async eliminar(req, res, next) {
    try {
      const idZona = Number(req.params.id);
      if (isNaN(idZona)) return res.status(400).json({ message: 'idZona inválido' });

      const ok = await ZonaDeRepartoModel.eliminar(idZona);
      if (!ok) return res.status(404).json({ message: 'Zona de reparto no encontrada' });

      return res.status(200).json({
      message: 'Zona eliminada correctamente',
      idZona
    });
    } catch (err) {
      next(err);
    }
  }
}

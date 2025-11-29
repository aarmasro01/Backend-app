import { db } from '../config/db.js';

const TABLE = 'repartidor';

const COLS = {
  id: 'idRepartidor',
  idUsuario: 'idUsuario',
  nombre: 'nombreCompleto',
  correo: 'correo',
  telefono: 'telefono'
};

export class RepartidorModel {

  static async crear({ idUsuario, nombreCompleto, correo, telefono }) {
    const sql = `
      INSERT INTO ${TABLE} (${COLS.idUsuario}, ${COLS.nombre}, ${COLS.correo}, ${COLS.telefono})
      VALUES (?, ?, ?, ?)
    `;
    const params = [idUsuario, nombreCompleto, correo, telefono];
    const [result] = await db.query(sql, params);
    return result.insertId;
  }

  static async obtenerTodos() {
    const sql = `
      SELECT ${COLS.id}, ${COLS.idUsuario}, ${COLS.nombre}, ${COLS.correo}, ${COLS.telefono}
      FROM ${TABLE}
    `;
    const [rows] = await db.query(sql);
    return rows;
  }

  static async obtenerPorId(idRepartidor) {
    const sql = `
      SELECT ${COLS.id}, ${COLS.idUsuario}, ${COLS.nombre}, ${COLS.correo}, ${COLS.telefono}
      FROM ${TABLE}
      WHERE ${COLS.id} = ?
    `;
    const [rows] = await db.query(sql, [idRepartidor]);
    return rows.length ? rows[0] : null;
  }

  static async actualizar(idRepartidor, { idUsuario, nombreCompleto, correo, telefono }) {
    const sql = `
      UPDATE ${TABLE}
      SET ${COLS.idUsuario} = ?, ${COLS.nombre} = ?, ${COLS.correo} = ?, ${COLS.telefono} = ?
      WHERE ${COLS.id} = ?
    `;
    const params = [idUsuario, nombreCompleto, correo, telefono, idRepartidor];
    const [result] = await db.query(sql, params);
    return result.affectedRows > 0;
  }

  static async eliminar(idRepartidor) {
    const sql = `
      DELETE FROM ${TABLE}
      WHERE ${COLS.id} = ?
    `;
    const [result] = await db.query(sql, [idRepartidor]);
    return result.affectedRows > 0;
  }

}

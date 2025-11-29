import { db } from '../config/db.js';

const TABLE = 'zonadereparto';
const COLS = {
  id: 'idZona',
  distrito: 'distrito',
  costo: 'costoEnvio',
};

export class ZonaDeRepartoModel {
  static async crear({ distrito, costoEnvio }) {
    const sql = `
      INSERT INTO ${TABLE} (\`${COLS.distrito}\`, \`${COLS.costo}\`)
      VALUES (?, ?)
    `;
    const [result] = await db.query(sql, [distrito, costoEnvio]);
    return result.insertId;
  }

  static async obtenerTodos() {
    const sql = `
      SELECT \`${COLS.id}\`, \`${COLS.distrito}\`, \`${COLS.costo}\`
      FROM \`${TABLE}\`
      ORDER BY \`${COLS.distrito}\` ASC
    `;
    const [rows] = await db.query(sql);
    return rows;
  }

  static async obtenerPorId(idZona) {
    const sql = `
      SELECT \`${COLS.id}\`, \`${COLS.distrito}\`, \`${COLS.costo}\`
      FROM \`${TABLE}\`
      WHERE \`${COLS.id}\` = ?
    `;
    const [rows] = await db.query(sql, [idZona]);
    return rows.length ? rows[0] : null;
  }

  static async actualizar(idZona, { distrito, costoEnvio }) {
    const sql = `
      UPDATE ${TABLE}
      SET \`${COLS.distrito}\` = ?, \`${COLS.costo}\` = ?
      WHERE \`${COLS.id}\` = ?
    `;
    const [result] = await db.query(sql, [distrito, costoEnvio, idZona]);
    return result.affectedRows > 0;
  }

  static async eliminar(idZona) {
    const sql = `
      DELETE FROM ${TABLE}
      WHERE \`${COLS.id}\` = ?
    `;
    const [result] = await db.query(sql, [idZona]);
    return result.affectedRows > 0;
  }
}

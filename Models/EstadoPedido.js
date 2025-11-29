import { db } from '../config/db.js';

const TABLE = 'estadopedido';
const COLS = {
  id: 'idEstadoPedido',
  nombre: 'nombreEstadoPedido'
};

export class EstadoPedidoModel {
  static async agregarEstado(nombreEstadoPedido) {
    const sql = `INSERT INTO \`${TABLE}\` (\`${COLS.nombre}\`) VALUES (?)`;
    const params = [nombreEstadoPedido];
    const [result] = await db.query(sql, params);
    return result.insertId;
  }

  static async obtenerTodos() {
    const sql = `SELECT \`${COLS.id}\`, \`${COLS.nombre}\` FROM \`${TABLE}\``;
    const [rows] = await db.query(sql);
    return rows;
  }

  static async obtenerPorId(id) {
    const sql = `
      SELECT 
        \`${COLS.id}\`,
        \`${COLS.nombre}\`
      FROM \`${TABLE}\`
      WHERE \`${COLS.id}\` = ?
    `;
    const [rows] = await db.query(sql, [id]);
    return rows.length ? rows[0] : null;
  }

  static async actualizar(id, nombreEstadoPedido) {
    const sql = `UPDATE \`${TABLE}\` SET \`${COLS.nombre}\` = ? WHERE \`${COLS.id}\` = ?`;
    const [result] = await db.query(sql, [nombreEstadoPedido, id]);
    return result.affectedRows > 0;
  }

  static async eliminar(id) {
    const sql = `DELETE FROM \`${TABLE}\` WHERE \`${COLS.id}\` = ?`;
    const [result] = await db.query(sql, [id]);
    return result.affectedRows > 0;
  }
}
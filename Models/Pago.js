import { db } from '../config/db.js';

const TABLE = 'pago';

const COLS = {
  id: 'idPago',
  metodo: 'metodoPago',
  comprobante: 'comprobantePago',
  fecha: 'fechaPago',
  monto: 'montoPago',
};

const formatDateTime = (value) => {
  if (!value) return null;

  // Si es Date
  if (value instanceof Date) {
    return value.toISOString().slice(0, 19).replace('T', ' ');
  }

  // Si viene en string
  const date = new Date(value);
  if (!isNaN(date.getTime())) {
    return date.toISOString().slice(0, 19).replace('T', ' ');
  }

  return null;
};

export class PagoModel {
  static async agregarPago({ metodoPago, comprobantePago, fechaPago, montoPago }) {
    const fecha =
      formatDateTime(fechaPago) ??
      formatDateTime(new Date());

    const sql = `
      INSERT INTO ${TABLE} 
      (${COLS.metodo}, ${COLS.comprobante}, ${COLS.fecha}, ${COLS.monto})
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      metodoPago,
      comprobantePago,
      fecha,
      montoPago,
    ]);

    return result.insertId;
  }

  static async obtenerIdUltimoPago() {
    const sql = `
      SELECT ${COLS.id} 
      FROM ${TABLE} 
      ORDER BY ${COLS.id} DESC 
      LIMIT 1
    `;
    const [rows] = await db.query(sql);
    return rows.length ? rows[0][COLS.id] : null;
  }

  static async obtenerPorId(idPago) {
    const sql = `
      SELECT * 
      FROM ${TABLE}
      WHERE ${COLS.id} = ?
      LIMIT 1
    `;
    const [rows] = await db.query(sql, [idPago]);
    return rows.length ? rows[0] : null;
  }

  static async obtenerTodos() {
    const sql = `SELECT * FROM ${TABLE}`;
    const [rows] = await db.query(sql);
    return rows;
  }
}

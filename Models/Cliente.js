import { db } from '../config/db.js';

const TABLE = 'cliente';
const COLS = {
  id: 'idCliente',
  usuario: 'idUsuario',
  nombre: 'nombreCompleto',
  correo: 'correo',
  telefono: 'telefono'
};

export class ClienteModel {
  static async obtenerIdClienteUsuario(idUsuario) {
    const sql = `SELECT \`${COLS.id}\` FROM \`${TABLE}\` WHERE \`${COLS.usuario}\` = ? LIMIT 1`;
    const [rows] = await db.query(sql, [idUsuario]);
    return rows.length ? rows[0] : null;
  }

  static async agregarCliente({ idUsuario, nombreCompleto, correo, telefono }) {
    const sql = `
      INSERT INTO \`${TABLE}\` 
      (\`${COLS.usuario}\`, \`${COLS.nombre}\`, \`${COLS.correo}\`, \`${COLS.telefono}\`)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [idUsuario, nombreCompleto, correo, telefono]);
    return { idCliente: result.insertId, idUsuario, nombreCompleto, correo, telefono };
  }
}

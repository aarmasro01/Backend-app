import { db } from '../config/db.js';

const TABLE = 'asignacionpedido';

const COLS = {
  id: 'idAsignacion',
  idPedido: 'idPedido',
  idRepartidor: 'idRepartidor',
  fecha: 'fechaAsignacion',
  hora: 'horaAsignacion',
  estado: 'estadoAsignacion'
};

export class AsignacionPedidoModel {

  // INSERT
  static async agregar({ idPedido, idRepartidor, fechaAsignacion, horaAsignacion, estadoAsignacion }) {
    const sql = `
      INSERT INTO \`${TABLE}\` 
      (\`${COLS.idPedido}\`, \`${COLS.idRepartidor}\`, \`${COLS.fecha}\`, \`${COLS.hora}\`, \`${COLS.estado}\`)
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [idPedido, idRepartidor, fechaAsignacion, horaAsignacion, estadoAsignacion];
    const [result] = await db.query(sql, params);
    return result.insertId;
  }

  // UPDATE por idRepartidor
  static async actualizarRepartidor(idAsignacion, nuevoIdRepartidor) {
  const sql = `
    UPDATE \`${TABLE}\`
    SET \`${COLS.idRepartidor}\` = ?
    WHERE \`${COLS.id}\` = ?
  `;
  
  const [result] = await db.query(sql, [nuevoIdRepartidor, idAsignacion]);
  return result.affectedRows > 0;
}


  // SELECT *
  static async obtenerTodos() {
    const sql = `
      SELECT \`${COLS.id}\`, \`${COLS.idPedido}\`, \`${COLS.idRepartidor}\`,
             \`${COLS.fecha}\`, \`${COLS.hora}\`, \`${COLS.estado}\`
      FROM \`${TABLE}\`
      ORDER BY \`${COLS.fecha}\` DESC, \`${COLS.hora}\` DESC, \`${COLS.id}\` DESC
    `;
    const [rows] = await db.query(sql);
    return rows;
  }

  // SELECT por idPedido
  static async obtenerPorIdPedido(idPedido) {
    const sql = `
      SELECT \`${COLS.id}\`, \`${COLS.idPedido}\`, \`${COLS.idRepartidor}\`,
             \`${COLS.fecha}\`, \`${COLS.hora}\`, \`${COLS.estado}\`
      FROM \`${TABLE}\`
      WHERE \`${COLS.idPedido}\` = ?
      ORDER BY \`${COLS.fecha}\` DESC, \`${COLS.hora}\` DESC, \`${COLS.id}\` DESC
    `;
    const [rows] = await db.query(sql, [idPedido]);
    return rows;
  }

  static async obtenerPorIdRepartidor(idRepartidor) {
    const sql = `
      SELECT \`${COLS.id}\`, \`${COLS.idPedido}\`, \`${COLS.idRepartidor}\`,
             \`${COLS.fecha}\`, \`${COLS.hora}\`, \`${COLS.estado}\`
      FROM \`${TABLE}\`
      WHERE \`${COLS.idRepartidor}\` = ?
      ORDER BY \`${COLS.fecha}\` DESC, \`${COLS.hora}\` DESC, \`${COLS.id}\` DESC
    `;
    const [rows] = await db.query(sql, [idRepartidor]);
    return rows;
  }
  
}

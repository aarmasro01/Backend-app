import { db } from '../config/db.js';

const SCHEMA = {
  table: 'reclamo',
  idCol: 'idReclamo',
  usuarioCol: 'idUsuario',
  nameCol: 'nombreCompleto',
  emailCol: 'correo',
  phoneCol: 'telefono',
  docTypeCol: 'tipoDocumento',
  docNumCol: 'numDocumento',
  deptCol: 'departamento',
  provCol: 'provincia',
  distCol: 'distrito',
  addressCol: 'direccion',
  amountCol: 'montoReclamo',
  orderNumCol: 'numPedido',
  orderDateCol: 'fechaPedido',
  tipoSoliCol: 'tipoSolicitud',
  detailsCol: 'detalles'
};

const normalize = (value) => {
  if (value === undefined || value === null) return null;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length ? trimmed : null;
  }
  return value;
};

const mapRow = row => ({
  idReclamo: row[SCHEMA.idCol],
  idUsuario: row[SCHEMA.usuarioCol],
  nombreCompleto: row[SCHEMA.nameCol],
  correo: row[SCHEMA.emailCol],
  telefono: row[SCHEMA.phoneCol],
  tipoDocumento: row[SCHEMA.docTypeCol],
  numDocumento: row[SCHEMA.docNumCol],
  departamento: row[SCHEMA.deptCol],
  provincia: row[SCHEMA.provCol],
  distrito: row[SCHEMA.distCol],
  direccion: row[SCHEMA.addressCol],
  montoReclamo: row[SCHEMA.amountCol],
  numPedido: row[SCHEMA.orderNumCol],
  fechaPedido: row[SCHEMA.orderDateCol],
  tipoSolicitud: row[SCHEMA.tipoSoliCol],
  detalles: row[SCHEMA.detailsCol]
});

export class ReclamoModel {
  static async create(data) {
    try {
      const payload = {
        idUsuario: normalize(data.idUsuario),
        nombreCompleto: normalize(data.nombreCompleto),
        correo: normalize(data.correo),
        telefono: normalize(data.telefono),
        tipoDocumento: normalize(data.tipoDocumento),
        numDocumento: normalize(data.numDocumento),
        departamento: normalize(data.departamento),
        provincia: normalize(data.provincia),
        distrito: normalize(data.distrito),
        direccion: normalize(data.direccion),
        montoReclamo: normalize(data.montoReclamo),
        numPedido: normalize(data.numPedido),
        fechaPedido: normalize(data.fechaPedido),
        tipoSolicitud: normalize(data.tipoSolicitud),
        detalles: normalize(data.detalles)
      };

      const sql = `
        INSERT INTO \`${SCHEMA.table}\`
        (\`${SCHEMA.usuarioCol}\`, \`${SCHEMA.nameCol}\`, \`${SCHEMA.emailCol}\`, \`${SCHEMA.phoneCol}\`,
         \`${SCHEMA.docTypeCol}\`, \`${SCHEMA.docNumCol}\`, \`${SCHEMA.deptCol}\`, \`${SCHEMA.provCol}\`,
         \`${SCHEMA.distCol}\`, \`${SCHEMA.addressCol}\`, \`${SCHEMA.amountCol}\`, \`${SCHEMA.orderNumCol}\`,
         \`${SCHEMA.orderDateCol}\`, \`${SCHEMA.tipoSoliCol}\`, \`${SCHEMA.detailsCol}\`)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const params = [
        payload.idUsuario,
        payload.nombreCompleto,
        payload.correo,
        payload.telefono,
        payload.tipoDocumento,
        payload.numDocumento,
        payload.departamento,
        payload.provincia,
        payload.distrito,
        payload.direccion,
        payload.montoReclamo,
        payload.numPedido,
        payload.fechaPedido,
        payload.tipoSolicitud,
        payload.detalles
      ];

      const [result] = await db.query(sql, params);
      return result.insertId;
    } catch (error) {
      console.error('ReclamoModel.create error:', error);
      throw error;
    }
  }

  static async findAll() {
    try {
      const sql = `SELECT * FROM \`${SCHEMA.table}\` ORDER BY \`${SCHEMA.idCol}\` DESC`;
      const [rows] = await db.query(sql);
      return rows.map(mapRow);
    } catch (error) {
      console.error('ReclamoModel.findAll error:', error);
      throw error;
    }
  }

  static async findByUsuario(idUsuario) {
    try {
      const sql = `SELECT * FROM \`${SCHEMA.table}\` WHERE \`${SCHEMA.usuarioCol}\` = ? ORDER BY \`${SCHEMA.idCol}\` DESC`;
      const [rows] = await db.query(sql, [idUsuario]);
      return rows.map(mapRow);
    } catch (error) {
      console.error('ReclamoModel.findByCliente error:', error);
      throw error;
    }
  }

  static async findById(idReclamo) {
    try {
      const sql = `SELECT * FROM \`${SCHEMA.table}\` WHERE \`${SCHEMA.idCol}\` = ? LIMIT 1`;
      const [rows] = await db.query(sql, [idReclamo]);
      return rows.length ? mapRow(rows[0]) : null;
    } catch (error) {
      console.error('ReclamoModel.findById error:', error);
      throw error;
    }
  }
}

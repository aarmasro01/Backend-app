import { db } from '../config/db.js';

const TABLE = 'detallepedido';
const COLS = {
  id: 'idDetallePedido',
  pedido: 'idPedido',
  producto: 'idProducto',
  precio: 'precioUnitario',
  cantidad: 'cantidad',
  subtotal: 'subtotal'
};

export class DetallePedidoModel {
  static async agregarDetallePedido({ idPedido, idProducto, precioUnitario, cantidad, subtotal }) {
    const sql = `INSERT INTO \`${TABLE}\` (\`${COLS.pedido}\`, \`${COLS.producto}\`, \`${COLS.precio}\`, \`${COLS.cantidad}\`, \`${COLS.subtotal}\`) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await db.query(sql, [idPedido, idProducto, precioUnitario, cantidad, subtotal]);
    return result.insertId;
  }

  static async obtenerDetallesPedidoId(idPedido) {
    const sql = `SELECT \`${COLS.id}\`, \`${COLS.producto}\`, \`${COLS.precio}\`, \`${COLS.cantidad}\`, \`${COLS.subtotal}\` FROM \`${TABLE}\` WHERE \`${COLS.pedido}\` = ? ORDER BY \`${COLS.id}\``;
    const [rows] = await db.query(sql, [idPedido]);
    return rows;
  }
}

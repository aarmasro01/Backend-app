// ...existing code...
import { db } from '../config/db.js';

export class ProductModel {
  static async findAll() {
    try {
      const sql = `
        SELECT p.idProducto, p.nombre, p.precio, p.imagenProducto,
                p.idCategoriaMenu, p.idEstadoProducto
        FROM producto p
        ORDER BY p.nombre;
      `;
      const [rows] = await db.query(sql);
      return rows;
    } catch (err) {
      console.error('ProductModel.findAll error:', err);
      throw err;
    }
  }

  static async findById(idProducto) {
    try {
      const sql = `
        SELECT p.*, c.nombreCategoria AS categoria, e.nombreEstadoProducto AS estado
        FROM producto p
        JOIN categoriaMenu c ON p.idCategoriaMenu = c.idCategoriaMenu
        JOIN estadoproducto e ON p.idEstadoProducto = e.idEstadoProducto
        WHERE p.idProducto = ?
      `;
      const [rows] = await db.query(sql, [idProducto]);
      return rows[0] ?? null;
    } catch (err) {
      console.error('ProductModel.findById error:', err);
      throw err;
    }
  }

  static async create({ idCategoriaMenu, nombre, precio, idEstadoProducto, imagenProducto }) {
    try {
      const sql = `
        INSERT INTO producto (idCategoriaMenu, nombre, precio, idEstadoProducto, imagenProducto)
        VALUES (?, ?, ?, ?, ?)
      `;
      const [result] = await db.query(sql, [idCategoriaMenu, nombre, precio, idEstadoProducto, imagenProducto]);
      return result.insertId;
    } catch (err) {
      console.error('ProductModel.create error:', err);
      throw err;
    }
  }

  static async update(idProducto, { nombre, precio, idCategoriaMenu, idEstadoProducto, imagenProducto }) {
    try {
      const sql = `
        UPDATE producto
        SET nombre = ?, precio = ?, idCategoriaMenu = ?, idEstadoProducto = ?, imagenProducto = ?
        WHERE idProducto = ?
      `;
      const [result] = await db.query(sql, [nombre, precio, idCategoriaMenu, idEstadoProducto, imagenProducto, idProducto]);
      return result.affectedRows > 0;
    } catch (err) {
      console.error('ProductModel.update error:', err);
      throw err;
    }
  }

  static async delete(idProducto) {
    try {
      const sql = 'DELETE FROM producto WHERE idProducto = ?';
      const [result] = await db.query(sql, [idProducto]);
      return result.affectedRows > 0;
    } catch (err) {
      console.error('ProductModel.delete error:', err);
      throw err;
    }
  }
}
// ...existing code...
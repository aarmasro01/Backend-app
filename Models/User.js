import { db } from '../config/db.js';

const SCHEMA = {
  table: 'usuario',
  idCol: 'idUsuario',
  roleCol: 'idRolUsuario',
  nameCol: 'nombreCompleto',
  emailCol: 'correo',
  phoneCol: 'telefono',
  passwordCol: 'contraseña',
  imageCol: 'imagenPerfil'
};

export class UserModel {
  static table() { return SCHEMA.table; }
  static idCol() { return SCHEMA.idCol; }
  static roleCol() { return SCHEMA.roleCol; }
  static nameCol() { return SCHEMA.nameCol; }
  static emailCol() { return SCHEMA.emailCol; }
  static phoneCol() { return SCHEMA.phoneCol; }
  static passwordCol() { return SCHEMA.passwordCol; }
  static imageCol() { return SCHEMA.imageCol; }

  static async findByEmail(email) {
    try {
      const sql = `SELECT \`${this.idCol()}\`, \`${this.roleCol()}\`, \`${this.nameCol()}\` AS nombreCompleto, \`${this.emailCol()}\`, \`${this.phoneCol()}\`, \`${this.passwordCol()}\` AS password, \`${this.imageCol()}\` AS imagenPerfil FROM \`${this.table()}\` WHERE \`${this.emailCol()}\` = ? LIMIT 1`;
      const [rows] = await db.query(sql, [email]);
      const row = rows[0] ?? null;
      if (!row) return null;
      return {
        [this.idCol()]: row[this.idCol()],
        [this.roleCol()]: row[this.roleCol()],
        nombreCompleto: row.nombreCompleto,
        correo: row[this.emailCol()],
        telefono: row[this.phoneCol()],
        imagenPerfil: row.imagenPerfil ?? 'incognito.png',
        // devolver ambas propiedades para compatibilidad con el resto del código
        contrasena: row.password,
        password: row.password
      };
    } catch (err) {
      console.error('UserModel.findByEmail error:', err);
      throw err;
    }
  }

  static async create({ idRolUsuario = null, nombreCompleto, correo, contrasena, telefono = null, imagenPerfil = 'incognito.png' }) {
    try {
      // resolver idRolUsuario válido
      let roleId = idRolUsuario;
      if (roleId) {
        const [roleRows] = await db.query('SELECT idRolUsuario FROM rolusuario WHERE idRolUsuario = ? LIMIT 1', [roleId]);
        if (!roleRows || roleRows.length === 0) roleId = null;
      }
      if (!roleId) {
        // intentar obtener primer rol existente o crear uno por defecto
        const [r] = await db.query('SELECT idRolUsuario FROM rolusuario ORDER BY idRolUsuario LIMIT 1');
        if (r && r.length) roleId = r[0].idRolUsuario;
        else {
          const [ins] = await db.query('INSERT INTO rolusuario (nombreRol) VALUES (?)', ['Cliente']);
          roleId = ins.insertId;
        }
      }

      const sql = `INSERT INTO \`${this.table()}\` (\`${this.roleCol()}\`, \`${this.nameCol()}\`, \`${this.emailCol()}\`, \`${this.phoneCol()}\`, \`${this.passwordCol()}\`, \`${this.imageCol()}\`) VALUES (?, ?, ?, ?, ?, ?)`;
      const [result] = await db.query(sql, [roleId, nombreCompleto, correo, telefono, contrasena, imagenPerfil]);
      return result.insertId;
    } catch (err) {
      console.error('UserModel.create error:', err);
      throw err;
    }
  }

  static async findById(id) {
    try {
      const sql = `SELECT \`${this.idCol()}\`, \`${this.roleCol()}\`, \`${this.nameCol()}\` AS nombreCompleto, \`${this.emailCol()}\`, \`${this.phoneCol()}\`, \`${this.passwordCol()}\` AS password FROM \`${this.table()}\` WHERE \`${this.idCol()}\` = ? LIMIT 1`;
      const [rows] = await db.query(sql, [id]);
      const row = rows[0] ?? null;
      if (!row) return null;
      return {
        [this.idCol()]: row[this.idCol()],
        [this.roleCol()]: row[this.roleCol()],
        nombreCompleto: row.nombreCompleto,
        correo: row[this.emailCol()],
        telefono: row[this.phoneCol()],
        contrasena: row.password,
        password: row.password
      };
    } catch (err) {
      console.error('UserModel.findById error:', err);
      throw err;
    }
  }

  static async updatePassword(id, hashedPassword) {
    try {
      const sql = `UPDATE \`${this.table()}\` SET \`${this.passwordCol()}\` = ? WHERE \`${this.idCol()}\` = ?`;
      const [result] = await db.query(sql, [hashedPassword, id]);
      return result.affectedRows > 0;
    } catch (err) {
      console.error('UserModel.updatePassword error:', err);
      throw err;
    }
  }

  static async getUltimoUsuarioId() {
    try {
      const sql = `SELECT \`${this.idCol()}\` FROM \`${this.table()}\` ORDER BY \`${this.idCol()}\` DESC LIMIT 1`;
      const [rows] = await db.query(sql);
      return rows.length ? rows[0][this.idCol()] : null;
    } catch (err) {
      console.error('UserModel.getUltimoUsuarioId error:', err);
      throw err;
    }
  }

  static async getAllUsers() {
  try {
    console.log('Obteniendo todos los usuarios...');
    const [rows] = await db.query(`
      SELECT 
        u.idUsuario, 
        u.idRolUsuario,
        u.correo, 
        u.nombreCompleto, 
        u.telefono, 
        u.contraseña,
        u.imagenPerfil   
      FROM usuario u
      ORDER BY u.idUsuario
    `);
    console.log('Total usuarios obtenidos:', rows.length);
    return rows;
  } catch (error) {
    console.error('UserModel.getAllUsers error:', error);
    throw error;
  }
}


  static async update(idUsuario, userData) {
  try {
    console.log('Actualizando usuario ID:', idUsuario);
    const [result] = await db.query(
      `UPDATE usuario SET 
         idRolUsuario = ?,
         correo = ?, 
         nombreCompleto = ?, 
         telefono = ?, 
         contraseña = ?,
         imagenPerfil = ?
       WHERE idUsuario = ?`,
      [
        userData.idRolUsuario,
        userData.correo,
        userData.nombreCompleto,
        userData.telefono,
        userData.contraseña,
        userData.imagenPerfil || 'incognito.png',  // 🔹 mantener minúsculas coherentes
        idUsuario
      ]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error('UserModel.update error:', error);
    throw error;
  }
}


  static async delete(idUsuario) {
    try {
      console.log('Eliminando usuario ID:', idUsuario);
      
      // Primero eliminar registros relacionados
      await db.query('DELETE FROM cliente WHERE idUsuario = ?', [idUsuario]);
      await db.query('DELETE FROM empleado WHERE idUsuario = ?', [idUsuario]);
      await db.query('DELETE FROM repartidor WHERE idUsuario = ?', [idUsuario]);
      await db.query('DELETE FROM encargado WHERE idUsuario = ?', [idUsuario]);
      
      // Luego eliminar el usuario
      const [result] = await db.query(
        'DELETE FROM usuario WHERE idUsuario = ?',
        [idUsuario]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('UserModel.delete error:', error);
      throw error;
    }
  }

}
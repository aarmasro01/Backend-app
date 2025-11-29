import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { UserModel } from '../Models/User.js';

// Configuración de Nodemailer (transporter)
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USER || 'molerojesus69@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

class AuthController {
  async registrarUsuario(req, res) {
    try {
      const { nombreCompleto, correo, email, password, contrasena, telefono, idRolUsuario } = req.body;
      const userEmail = correo || email;
      const plain = password || contrasena;
      if (!plain || !userEmail) return res.status(400).json({ error: 'Faltan campos' });

      const existingUser = await UserModel.findByEmail(userEmail);
      if (existingUser) return res.status(400).json({ error: 'El correo ya está registrado' });

      const hashedPassword = await bcrypt.hash(plain, 10);
      const imagenPerfil = 'incognito.png';

      const id = await UserModel.create({
        idRolUsuario: idRolUsuario ?? null,
        nombreCompleto,
        correo: userEmail,
        contrasena: hashedPassword,
        telefono: telefono ?? null,
        imagenPerfil
      });

      res.status(201).json({ message: '✅ Usuario registrado correctamente', id, imagenPerfil });
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      res.status(500).json({ error: 'Error al registrar usuario' });
    }
  }

  async iniciarSesion(req, res) {
    try {
      const { correo, email, password, contrasena } = req.body;
      const userEmail = correo || email;
      const plain = password || contrasena;
      if (!userEmail || !plain) return res.status(400).json({ error: 'Faltan campos' });

      const user = await UserModel.findByEmail(userEmail);
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

      const stored = user.contrasena ?? user.password ?? user.correo;
      const validPassword = await bcrypt.compare(plain, stored);
      if (!validPassword) return res.status(401).json({ error: 'Contraseña incorrecta' });

      const token = jwt.sign({ idUsuario: user.idUsuario, correo: user.correo ?? userEmail }, process.env.JWT_SECRET, { expiresIn: '1h' });

      const usuario = {
        idUsuario: user.idUsuario,
        idRolUsuario: user.idRolUsuario,
        nombreCompleto: user.nombreCompleto,
        correo: user.correo ?? userEmail,
        telefono: user.telefono ?? null,
        password: stored,
        imagenPerfil: user.imagenPerfil ?? 'incognito.png'
      };

      res.json({
        message: '✅ Inicio de sesión exitoso',
        token,
        usuario
      });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  }

  async solicitarRestablecimiento(req, res) {
    try {
      const { correo, email } = req.body;
      const userEmail = correo || email;
      if (!userEmail) return res.status(400).json({ error: 'Falta el correo' });

      const user = await UserModel.findByEmail(userEmail);
      // Respuesta genérica para no filtrar existencia de emails
      if (!user) return res.status(200).json({ message: 'Si el correo existe, recibirás un enlace para restablecer tu contraseña.' });

      const token = jwt.sign({ idUsuario: user.idUsuario }, process.env.JWT_SECRET, { expiresIn: '1h' });

      const mailOptions = {
        from: process.env.GMAIL_USER || 'molerojesus69@gmail.com',
        to: user.correo,
        subject: 'Restablecer Contraseña',
        html: `Haz clic en este enlace para restablecer tu contraseña: <a href="http://localhost:5500/reset-password.html?token=${token}">Restablecer Contraseña</a>`
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: 'Si el correo existe, recibirás un enlace para restablecer tu contraseña.' });
    } catch (error) {
      console.error('Error al enviar el correo de restablecimiento:', error);
      res.status(500).json({ error: 'Error al enviar el correo de restablecimiento' });
    }
  }

  async restablecerContraseña(req, res) {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) return res.status(400).json({ error: 'Faltan campos' });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await UserModel.findById(decoded.idUsuario);
      if (!user) return res.status(400).json({ error: 'Token inválido o expirado.' });

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await UserModel.updatePassword(user.idUsuario, hashedPassword);

      res.status(200).json({ message: 'Contraseña actualizada exitosamente.' });
    } catch (error) {
      console.error('Error al restablecer la contraseña:', error);
      res.status(500).json({ error: 'Error al restablecer la contraseña' });
    }
  }

  async obtenerUltimoUsuario(req, res) {
  try {
    const idUltimoUsuario = await UserModel.getUltimoUsuarioId();
    if (!idUltimoUsuario) {
      return res.status(404).json({ error: 'No hay usuarios registrados' });
    }
    res.json({ idUsuario: idUltimoUsuario });
  } catch (error) {
    console.error('Error al obtener el último usuario:', error);
    res.status(500).json({ error: 'Error al obtener el último usuario' });
  }
}

  async obtenerUsuarios(req, res) {
    try {
      const usuarios = await UserModel.getAllUsers();
      res.status(200).json(usuarios);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  }

  // =====================
  // 📌 NUEVO: ACTUALIZAR USUARIO
  // =====================
  async actualizarUsuario(req, res) {
  try {
    const { id } = req.params;
    const userData = req.body;

    // 1️⃣ Si el usuario envía una contraseña nueva → encriptarla
    if (userData.contraseña) {
      const salt = await bcrypt.genSalt(10);
      userData.contraseña = await bcrypt.hash(userData.contraseña, salt);
    }

    // 2️⃣ Actualizar en la base de datos
    const actualizado = await UserModel.update(id, userData);

    if (!actualizado) {
      return res.status(404).json({ error: 'Usuario no encontrado o sin cambios' });
    }

    res.status(200).json({ message: '✅ Usuario actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
}

  // =====================
  // 📌 NUEVO: ELIMINAR USUARIO
  // =====================
  async eliminarUsuario(req, res) {
    try {
      const { id } = req.params;
      const eliminado = await UserModel.delete(id);

      if (!eliminado) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      res.status(200).json({ message: '🗑️ Usuario eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({ error: 'Error al eliminar usuario' });
    }
  }


   
}

export const authController = new AuthController();
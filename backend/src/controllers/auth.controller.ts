import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Usuario from '../models/usuario';

export const JWT_SECRET = process.env.JWT_SECRET || 'secreto_super_seguro_empleados_mean_2026';

export const registro = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      res.status(400).json({ mensaje: 'Todos los campos son requeridos (nombre, email, password)' });
      return;
    }

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      res.status(400).json({ mensaje: 'El correo electrónico ya está registrado' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: passwordHashed
    });

    await nuevoUsuario.save();

    const token = jwt.sign(
      { id: nuevoUsuario._id, email: nuevoUsuario.email, nombre: nuevoUsuario.nombre },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      mensaje: 'Usuario registrado con éxito',
      token,
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ mensaje: 'Error interno en el servidor al registrar usuario' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ mensaje: 'Email y contraseña son requeridos' });
      return;
    }

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      res.status(400).json({ mensaje: 'Credenciales inválidas: correo no encontrado' });
      return;
    }

    const esValido = await bcrypt.compare(password, usuario.password);
    if (!esValido) {
      res.status(400).json({ mensaje: 'Credenciales inválidas: contraseña incorrecta' });
      return;
    }

    const token = jwt.sign(
      { id: usuario._id, email: usuario.email, nombre: usuario.nombre },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ mensaje: 'Error interno en el servidor al iniciar sesión' });
  }
};

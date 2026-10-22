import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../controllers/auth.controller';

export interface AuthRequest extends Request {
  usuario?: any;
}

export const verificarToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : (authHeader as string | undefined);

  if (!token) {
    res.status(401).json({ mensaje: 'Acceso denegado: Token no proporcionado' });
    return;
  }

  try {
    const decodificado = jwt.verify(token, JWT_SECRET);
    req.usuario = decodificado;
    next();
  } catch (error) {
    res.status(403).json({ mensaje: 'Token inválido o expirado' });
  }
};

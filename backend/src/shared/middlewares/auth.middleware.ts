import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IApiResponse } from '../interfaces/response.interface';

// Extender los tipos de Express para admitir los datos del usuario autenticado
export interface IAuthRequest extends Request {
  user?: { id: string; rol: string };
  usuario?: any; // Compatibilidad
}

export const authenticateJWT = (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const SECRET_KEY = process.env.JWT_SECRET || 'MIS_LLAVE_SECRETA_DE_MAESTRIA_2026';

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const errorResponse: IApiResponse = {
      success: false,
      error: {
        message: 'Acceso denegado: No se proporcionó un token de autenticación válido',
        code: 'UNAUTHORIZED'
      },
      timestamp: new Date().toISOString()
    };
    res.status(401).json(errorResponse);
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: string; rol: string };
    req.user = decoded; // Inyección de contexto seguro
    req.usuario = decoded;
    return next();
  } catch (error) {
    const invalidResponse: IApiResponse = {
      success: false,
      error: {
        message: 'El token proporcionado ha expirado o su firma es inválida',
        code: 'FORBIDDEN'
      },
      timestamp: new Date().toISOString()
    };
    res.status(403).json(invalidResponse);
  }
};

// Alias de compatibilidad
export const verificarToken = authenticateJWT;

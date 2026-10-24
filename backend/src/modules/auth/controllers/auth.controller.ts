import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IAuthRepository } from '../repositories/auth.repository.interface';
import { IApiResponse } from '../../../shared/interfaces/response.interface';

export class AuthController {
  constructor(private authRepository: IAuthRepository) {}

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const SECRET_KEY = process.env.JWT_SECRET || 'MIS_LLAVE_SECRETA_DE_MAESTRIA_2026';

      // 1. Verificar existencia de la identidad
      const user = await this.authRepository.findByEmail(email);
      if (!user) {
        res.status(401).json({
          success: false,
          error: {
            message: 'Credenciales inválidas: El usuario no se encuentra registrado',
            code: 'AUTH_FAILED'
          },
          timestamp: new Date().toISOString()
        } as IApiResponse);
        return;
      }

      // 2. Comparar Hash Criptográfico de la Contraseña
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({
          success: false,
          error: {
            message: 'Credenciales inválidas: Contraseña incorrecta',
            code: 'AUTH_FAILED'
          },
          timestamp: new Date().toISOString()
        } as IApiResponse);
        return;
      }

      // 3. Generación y Firma Contractual del JWT (Expira en 2 horas)
      const token = jwt.sign(
        { id: user._id, rol: user.rol || 'alumno' },
        SECRET_KEY,
        { expiresIn: '2h' }
      );

      // 4. Salida envoltura estándar unificada
      const response: IApiResponse = {
        success: true,
        data: {
          token,
          user: { email: user.email, rol: user.rol || 'alumno' }
        },
        timestamp: new Date().toISOString()
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  registro = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password, rol } = req.body;
      const SECRET_KEY = process.env.JWT_SECRET || 'MIS_LLAVE_SECRETA_DE_MAESTRIA_2026';

      const userExists = await this.authRepository.findByEmail(email);
      if (userExists) {
        res.status(400).json({
          success: false,
          error: {
            message: 'El correo electrónico ya se encuentra registrado',
            code: 'USER_EXISTS'
          },
          timestamp: new Date().toISOString()
        } as IApiResponse);
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await this.authRepository.createUser({
        email,
        password: hashedPassword,
        rol: rol || 'alumno'
      });

      const token = jwt.sign(
        { id: newUser._id, rol: newUser.rol || 'alumno' },
        SECRET_KEY,
        { expiresIn: '2h' }
      );

      const response: IApiResponse = {
        success: true,
        data: {
          token,
          user: { email: newUser.email, rol: newUser.rol || 'alumno' }
        },
        timestamp: new Date().toISOString()
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };
}

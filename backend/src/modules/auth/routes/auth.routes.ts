import { Router } from 'express';
import { MongoAuthRepository } from '../repositories/mongo-auth.repository';
import { AuthController } from '../controllers/auth.controller';
import { validateRequest } from '../../../shared/middlewares/validate.middleware';
import { LoginSchema, RegisterSchema } from '../dtos/auth.dto';

const router = Router();
const authRepository = new MongoAuthRepository();
const authController = new AuthController(authRepository);

// Endpoint de login blindado perimetralmente con el DTO de Zod (PDF Punto 12)
router.post('/login', validateRequest(LoginSchema), authController.login);

// Endpoint de registro (para permitir alta de nuevos usuarios)
router.post('/registro', validateRequest(RegisterSchema), authController.registro);
router.post('/register', validateRequest(RegisterSchema), authController.registro);

export default router;

import { z } from 'zod';

export const LoginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'El correo electrónico es obligatorio' })
      .email('El formato del correo electrónico proporcionado no es válido')
      .trim(),
    password: z.string({ required_error: 'La contraseña es obligatoria' })
      .min(6, 'La credencial de acceso debe poseer una longitud mínima de 6 caracteres')
  })
});

export const RegisterSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'El correo electrónico es obligatorio' })
      .email('El formato del correo electrónico proporcionado no es válido')
      .trim(),
    password: z.string({ required_error: 'La contraseña es obligatoria' })
      .min(6, 'La credencial de acceso debe poseer una longitud mínima de 6 caracteres'),
    rol: z.string().optional()
  })
});

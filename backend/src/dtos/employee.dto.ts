import { z } from 'zod';

export const createEmployeeSchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'El nombre no puede exceder los 100 caracteres'),
    cargo: z
        .string()
        .trim()
        .min(2, 'El cargo debe tener al menos 2 caracteres')
        .max(100, 'El cargo no puede exceder los 100 caracteres'),
    departamento: z
        .string()
        .trim()
        .min(2, 'El departamento debe tener al menos 2 caracteres')
        .max(100, 'El departamento no puede exceder los 100 caracteres'),
    sueldo: z
        .number()
        .positive('El sueldo debe ser un valor numérico positivo mayor a 0')
});

export const updateEmployeeSchema = createEmployeeSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: 'Debe proporcionar al menos un campo para actualizar'
    });

export const employeeParamsSchema = z.object({
    id: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, 'El ID proporcionado no es un ObjectId válido de MongoDB')
});

export type CreateEmployeeDto = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeDto = z.infer<typeof updateEmployeeSchema>;
export type EmployeeParamsDto = z.infer<typeof employeeParamsSchema>;

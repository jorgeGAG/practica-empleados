import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ResponseWrapper } from '../utils/response.wrapper';

export class AppError extends Error {
    constructor(
        public readonly statusCode: number,
        message: string
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export const errorMiddleware = (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    if (err instanceof ZodError) {
        const issues = err.issues.map((issue) => ({
            campo: issue.path.join('.'),
            mensaje: issue.message
        }));

        res.status(400).json(
            ResponseWrapper.error('Error de validación en la solicitud', issues)
        );
        return;
    }

    if (err instanceof AppError) {
        res.status(err.statusCode).json(
            ResponseWrapper.error(err.message)
        );
        return;
    }

    if (err instanceof Error) {
        res.status(500).json(
            ResponseWrapper.error('Error interno del servidor', process.env.NODE_ENV === 'development' ? err.message : undefined)
        );
        return;
    }

    res.status(500).json(
        ResponseWrapper.error('Error interno desconocido en el servidor')
    );
};

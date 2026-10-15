import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';

interface ValidationSchema {
    body?: ZodTypeAny;
    params?: ZodTypeAny;
    query?: ZodTypeAny;
}

export const validate = (schema: ValidationSchema) => {
    return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
        try {
            if (schema.body) {
                req.body = await schema.body.parseAsync(req.body);
            }
            if (schema.params) {
                req.params = (await schema.params.parseAsync(req.params)) as Request['params'];
            }
            if (schema.query) {
                req.query = (await schema.query.parseAsync(req.query)) as Request['query'];
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};

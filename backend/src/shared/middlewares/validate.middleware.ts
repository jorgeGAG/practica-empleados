import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, AnyZodObject } from 'zod';

export const validateRequest = (schema: AnyZodObject | any) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (schema.shape && (schema.shape.body || schema.shape.params || schema.shape.query)) {
        await schema.parseAsync({
          body: req.body,
          query: req.query,
          params: req.params
        });
      } else if (schema.body || schema.params || schema.query) {
        if (schema.body) req.body = await schema.body.parseAsync(req.body);
        if (schema.params) req.params = await schema.params.parseAsync(req.params);
        if (schema.query) req.query = await schema.query.parseAsync(req.query);
      } else {
        req.body = await schema.parseAsync(req.body);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validate = validateRequest;

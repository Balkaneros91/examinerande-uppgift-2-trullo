import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export const validate = (schema: z.ZodTypeAny) => (req: Request, _res: Response, next: NextFunction) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });
  if (!result.success) {
    const error = new Error(result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', '));
    (error as any).statusCode = 400;
    return next(error);
  }
  next();
};
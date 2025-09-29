import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';


function formatZod(err: z.ZodError) {
  return err.issues.map(i => `${i.path.join('.') || '(root)'}: ${i.message}`).join(', ');
}

export function validateBody<T>(schema: z.ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return next({ status: 400, message: formatZod(parsed.error) });
    req.body = parsed.data as any;
    next();
  };
}

export function validateQuery<T>(schema: z.ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.query);
    if (!parsed.success) return next({ status: 400, message: formatZod(parsed.error) });
    req.query = parsed.data as any;
    next();
  };
}

export function validateParams<T>(schema: z.ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.params);
    if (!parsed.success) return next({ status: 400, message: formatZod(parsed.error) });
    req.params = parsed.data as any;
    next();
  };
}
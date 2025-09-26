import type { NextFunction, Request, Response } from 'express';

export function notFound(_req: Request, res: Response, _next: NextFunction) {
  res.status(404).json({ error: { code: 404, message: 'Not found' } });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const message = err instanceof Error ? err.message : 'Unknown error';
  const status = (err as any)?.statusCode ?? 500;
  res.status(status).json({ message });
}
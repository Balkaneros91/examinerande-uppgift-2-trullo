import type { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

export function notFound(_req: Request, res: Response, _next: NextFunction) {
  res.status(404).json({ error: { code: 404, message: 'Not found' } });
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err?.status || err?.statusCode;

  if (status && err?.message) {
    return res.status(status).json({ code: status, message: err.message, details: err.details });
  }

  if (err?.code === 11000) {
    return res.status(409).json({ code: 409, message: 'Duplicate key error', details: err.keyValue });
  }

  if (err?.name === 'CastError') {
    return res.status(400).json({ error: { code: 400, message: `Invalid ID format`, details: { path: err.path, value: err.value} } });
  }

  if (err?.name === 'ValidationError' || err instanceof mongoose.Error.ValidationError) {
    const details = Object.values((err as any).errors ?? {}).map((e: any) => ({
      path: e?.path,
      message: e?.message,
      kind: e?.kind,
      value: e?.value
    }));
    return res.status(400).json({ error: { code: 400, message: 'Validation error', details } });
  }

  console.error(err);
  res.status(500).json({ error: { code: 500, message: 'Internal server error' } });
}
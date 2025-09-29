import type { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

export function notFound(_req: Request, res: Response, _next: NextFunction) {
  res.status(404).json({ error: { code: 404, message: 'Resource not found' } });
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  
  const status = err?.status || err?.statusCode;

  if (status) {
    const message = err?.message ?? (status === 404 ? 'Resource not found' : 'Error');
    return res.status(status).json({ error: { code: status, message, details: err?.details } });
  }

  if (err?.code === 11000) {
    return res.status(409).json({ code: 409, message: 'Duplicate key error', details: err.keyValue });
  }

  if (err?.name === 'CastError') {
    return res.status(400).json({ error: { code: 400, message: `Invalid ID format`, details: { path: (err as any).path, value: (err as any).value} } });
  }

  if (err?.name === 'DocumentNotFoundError') {
    return res.status(404).json({ error: { code: 404, message: 'Document not found' } });
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
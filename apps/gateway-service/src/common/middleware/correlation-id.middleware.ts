import {
  CORRELATION_ID_HEADER,
  generateCorrelationId,
  runWithCorrelationId,
} from '@app/infrastructure';
import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const incomingId = req.headers[CORRELATION_ID_HEADER];
    const correlationId =
      typeof incomingId === 'string' && incomingId.trim() !== ''
        ? incomingId.trim()
        : generateCorrelationId();

    res.setHeader(CORRELATION_ID_HEADER, correlationId);

    runWithCorrelationId(correlationId, () => {
      next();
    });
  }
}

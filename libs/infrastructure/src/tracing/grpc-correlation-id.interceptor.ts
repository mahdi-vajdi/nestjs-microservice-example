import { InterceptingCall, Interceptor, Metadata, Requester } from '@grpc/grpc-js';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

import {
  CORRELATION_ID_HEADER,
  generateCorrelationId,
  getCorrelationId,
  runWithCorrelationId,
} from './correlation-id.util';

@Injectable()
export class GrpcCorrelationIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() === 'rpc') {
      const rpc = context.switchToRpc();
      const metadata = rpc.getContext<Metadata>();
      let correlationId: string | undefined;

      if (metadata && typeof metadata.get === 'function') {
        const values = metadata.get(CORRELATION_ID_HEADER);
        if (values && values.length > 0) {
          const first = values[0];
          correlationId = typeof first === 'string' ? first : first.toString();
        }
      }

      if (!correlationId) {
        correlationId = generateCorrelationId();
      }

      return new Observable((subscriber) => {
        runWithCorrelationId(correlationId!, () => {
          next.handle().subscribe(subscriber);
        });
      });
    }
    return next.handle();
  }
}

export const grpcClientCorrelationIdInterceptor: Interceptor = (options, nextCall) => {
  const requester: Requester = {
    start: (metadata, listener, next) => {
      const correlationId = getCorrelationId();
      if (correlationId && !metadata.get(CORRELATION_ID_HEADER).length) {
        metadata.set(CORRELATION_ID_HEADER, correlationId);
      }
      next(metadata, listener);
    },
  };
  return new InterceptingCall(nextCall(options), requester);
};


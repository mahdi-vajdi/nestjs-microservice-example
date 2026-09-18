import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';

import { Metadata } from '@grpc/grpc-js';

export const CORRELATION_ID_HEADER = 'x-correlation-id';

const correlationIdStorage = new AsyncLocalStorage<string>();

export const CorrelationIdStorage = correlationIdStorage;

export function generateCorrelationId(): string {
  return randomUUID();
}

export function getCorrelationId(): string | undefined {
  return correlationIdStorage.getStore();
}

export function runWithCorrelationId<T>(correlationId: string, fn: () => T): T {
  return correlationIdStorage.run(correlationId, fn);
}

export function createGrpcMetadata(correlationId?: string): Metadata {
  const metadata = new Metadata();
  const id = correlationId ?? getCorrelationId();
  if (id) {
    metadata.set(CORRELATION_ID_HEADER, id);
  }
  return metadata;
}

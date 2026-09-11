import { env } from 'node:process';

import { AUTH_PACKAGE, AUTH_PROTO_PATH } from '@app/contracts';
import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const AuthGrpcConfigSchema = z.object({
  host: z.string().default('0.0.0.0'),
  port: z.coerce.number().default(50052),
  package: z.string(),
  protoPath: z.string(),
});

export const authGrpcConfig = registerAs('auth-grpc', (): z.infer<typeof AuthGrpcConfigSchema> => {
  const config = {
    host: env.GRPC_AUTH_HOST ?? '0.0.0.0',
    port: Number(env.GRPC_AUTH_PORT ?? 50052),
    package: AUTH_PACKAGE,
    protoPath: AUTH_PROTO_PATH,
  };
  return AuthGrpcConfigSchema.parse(config);
});

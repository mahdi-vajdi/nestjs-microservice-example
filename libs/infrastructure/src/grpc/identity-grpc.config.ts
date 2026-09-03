import { env } from 'node:process';

import { IDENTITY_PACKAGE, IDENTITY_PROTO_PATH } from '@app/contracts';
import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const IdentityGrpcConfigSchema = z.object({
  host: z.string().default('0.0.0.0'),
  port: z.coerce.number().default(50051),
  package: z.string(),
  protoPath: z.string(),
});

export const identityGrpcConfig = registerAs(
  'identity-grpc',
  (): z.infer<typeof IdentityGrpcConfigSchema> => {
    const config = {
      host: env.GRPC_IDENTITY_HOST ?? '0.0.0.0',
      port: Number(env.GRPC_IDENTITY_PORT ?? 50051),
      package: IDENTITY_PACKAGE,
      protoPath: IDENTITY_PROTO_PATH,
    };
    return IdentityGrpcConfigSchema.parse(config);
  },
);

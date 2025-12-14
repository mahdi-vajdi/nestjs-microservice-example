import { env } from 'node:process';

import {
  IDENTITY_PACKAGE,
  IDENTITY_PROTO_PATH,
} from '@app/shared/contracts/grpc/identity/identity.interface';
import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const IdentityGrpcConfigSchema = z.object({
  url: z.string().default('0.0.0.0:50051'),
  port: z.coerce.number().default(50051),
  package: z.string(),
  protoPath: z.string(),
});

export const identityGrpcConfig = registerAs(
  'identity-grpc',
  (): z.infer<typeof IdentityGrpcConfigSchema> => {
    const config = {
      url: env.GRPC_IDENTITY_URL ?? '0.0.0.0:50051',
      port: env.GRPC_IDENTITY_PORT ?? 50051,
      package: IDENTITY_PACKAGE,
      protoPath: IDENTITY_PROTO_PATH,
    };
    return IdentityGrpcConfigSchema.parse(config);
  },
);

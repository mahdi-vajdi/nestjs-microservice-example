import { env } from 'node:process';

import { USER_PACKAGE, USER_PROTO_PATH } from '@app/contracts';
import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const UserGrpcConfigSchema = z.object({
  host: z.string().default('0.0.0.0'),
  port: z.coerce.number().default(50051),
  package: z.string(),
  protoPath: z.string(),
});

export const userGrpcConfig = registerAs(
  'user-grpc',
  (): z.infer<typeof UserGrpcConfigSchema> => {
    const config = {
      host: env.GRPC_USER_HOST ?? '0.0.0.0',
      port: Number(env.GRPC_USER_PORT ?? 50051),
      package: USER_PACKAGE,
      protoPath: USER_PROTO_PATH,
    };
    return UserGrpcConfigSchema.parse(config);
  },
);

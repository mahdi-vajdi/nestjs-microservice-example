import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import {
  ACCOUNT_GRPC_CLIENT_PROVIDER,
  ACCOUNT_GRPC_CONFIG_TOKEN,
  accountGrpcConfig,
  IAccountGrpcConfig,
} from '@app/common/grpc/configs/account-grpc.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  AGENT_GRPC_CLIENT_PROVIDER,
  AGENT_GRPC_CONFIG_TOKEN,
  agentGrpcConfig,
  IAgentGrpcConfig,
} from '@app/common/grpc/configs/agent-grpc.config';
import { ACCOUNT_READER } from './providers/account.reader';
import { AccountGrpcService } from './grpc/account-grpc.service';
import { AgentGrpcService } from './grpc/agent-grpc.service';
import { AGENT_READER } from './providers/agent.reader';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: ACCOUNT_GRPC_CLIENT_PROVIDER,
        useFactory: (configService: ConfigService) => {
          return configService.get<IAccountGrpcConfig>(
            ACCOUNT_GRPC_CONFIG_TOKEN,
          );
        },
        inject: [ConfigService],
        imports: [ConfigModule.forFeature(accountGrpcConfig)],
      },
      {
        name: AGENT_GRPC_CLIENT_PROVIDER,
        useFactory: (configService: ConfigService) => {
          return configService.get<IAgentGrpcConfig>(AGENT_GRPC_CONFIG_TOKEN);
        },
        inject: [ConfigService],
        imports: [ConfigModule.forFeature(agentGrpcConfig)],
      },
    ]),
  ],
  providers: [
    {
      provide: ACCOUNT_READER,
      useClass: AccountGrpcService,
    },
    {
      provide: AGENT_READER,
      useClass: AgentGrpcService,
    },
  ],
  exports: [ACCOUNT_READER, AGENT_READER],
})
export class QueryClientModule {}

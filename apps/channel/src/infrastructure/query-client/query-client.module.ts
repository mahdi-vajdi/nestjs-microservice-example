import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import {
  AGENT_GRPC_CLIENT_PROVIDER,
  AGENT_GRPC_CONFIG_TOKEN,
  agentGrpcConfig,
  IAgentGrpcConfig,
} from '@app/common/grpc/configs/agent-grpc.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AGENT_READER } from './providers/agent.reader';
import { AgentGrpcService } from './grpc/agent-grpc.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
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
      provide: AGENT_READER,
      useClass: AgentGrpcService,
    },
  ],
  exports: [AGENT_READER],
})
export class QueryClientModule {}

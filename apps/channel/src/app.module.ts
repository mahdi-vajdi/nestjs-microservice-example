import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChannelEntityRepository } from './Domain/base-channel.repo';
import { ChannelEntityRepositoryImpl } from './Infrastructure/repositories/impl-channel.entity-repo';
import { ChannelChannelHandlers } from './Application/commands/handlers';
import { ChannelQueryHandlers } from './Application/queries/handlers';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CHANNEL_DB_COLLECTION,
  ChannelSchema,
} from './Infrastructure/models/channel.model';
import { CqrsModule } from '@nestjs/cqrs';
import { ChannelQueryRepository } from './Infrastructure/repositories/channel.query-repo';
import { ChannelGrpcController } from './presentation/grpc/channel.grpc-controller';
import { ChannelService } from './Application/services/channel.service';
import { LoggerModule } from '@app/common/logger/logger.module';
import { ClientsModule } from '@nestjs/microservices';
import {
  AGENT_GRPC_CLIENT_PROVIDER,
  AGENT_GRPC_CONFIG_TOKEN,
  agentGrpcConfig,
  IAgentGrpcConfig,
} from '@app/common/grpc/configs/agent-grpc.config';
import { ChannelNatsController } from './presentation/nats/channel-nats.controller';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
      load: [agentGrpcConfig],
    }),
    LoggerModule,
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: CHANNEL_DB_COLLECTION, schema: ChannelSchema },
    ]),
    ClientsModule.registerAsync([
      {
        name: AGENT_GRPC_CLIENT_PROVIDER,
        useFactory: (configService: ConfigService) => {
          return configService.get<IAgentGrpcConfig>(AGENT_GRPC_CONFIG_TOKEN);
        },
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ChannelNatsController, ChannelGrpcController],
  providers: [
    ChannelService,
    { provide: ChannelEntityRepository, useClass: ChannelEntityRepositoryImpl },
    ChannelQueryRepository,
    ...ChannelChannelHandlers,
    ...ChannelQueryHandlers,
  ],
})
export class AppModule {}

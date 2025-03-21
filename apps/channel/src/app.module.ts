import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, GrpcOptions } from '@nestjs/microservices';
import { GRPC_AGENT } from 'libs/common/src/grpc';
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
import { ChannelNatsController } from './Presentation/channel.nats-controller';
import { ChannelQueryRepository } from './Infrastructure/repositories/channel.query-repo';
import { ChannelGrpcController } from './Presentation/channel.grpc-controller';
import { ChannelService } from './Application/services/channel.service';
import { LoggerModule } from '@app/common/logger/logger.module';
import { AGENT_GRPC_CLIENT_PROVIDER } from '@app/common/grpc/options/agent.options';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        NATS_URI: Joi.string().required(),
        AUTH_GRPC_URL: Joi.string().required(),
        CHANNEL_GRPC_URL: Joi.string().required(),
        ACCOUNT_GRPC_URL: Joi.string().required(),
        AGENT_GRPC_URL: Joi.string().required(),
      }),
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
        name: GRPC_AGENT,
        useFactory: (configService: ConfigService) => {
          return configService.get<GrpcOptions>(AGENT_GRPC_CLIENT_PROVIDER);
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

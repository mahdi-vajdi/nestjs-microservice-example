import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AgentModel, AgentSchema } from './infrastructure/models/agent.model';
import { AgentEntityRepositoryImpl } from './infrastructure/repositories/impl-agent.entity-repo';
import { AgentQueryRepository } from './infrastructure/repositories/agent.query-repo';
import { AgentCommandHandlers } from './application/commands/handlers';
import { AgentQueryHandlers } from './application/queries/handlers';
import { AgentEntityRepository } from './domain/base-agent.entity-repo';
import { AgentService } from './application/services/agent.service';
import { LoggerModule } from '@app/common/logger/logger.module';
import { AgentGrpcController } from './presentation/grpc/agent-grpc.controller';
import { AgentNatsController } from './presentation/nats/agent-nats.controller';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      cache: true,
    }),
    LoggerModule,
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: AgentModel.name, schema: AgentSchema }]),
  ],
  controllers: [AgentGrpcController, AgentNatsController],
  providers: [
    AgentService,
    { provide: AgentEntityRepository, useClass: AgentEntityRepositoryImpl },
    AgentQueryRepository,
    ...AgentCommandHandlers,
    ...AgentQueryHandlers,
  ],
})
export class AppModule {}

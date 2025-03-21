import { Module } from '@nestjs/common';
import { AgentGrpcController } from './presentation/grpc/agent.grpc-controller';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AgentModel, AgentSchema } from './Infrastructure/models/agent.model';
import { AgentEntityRepositoryImpl } from './Infrastructure/repositories/impl-agent.entity-repo';
import { AgentQueryRepository } from './Infrastructure/repositories/agent.query-repo';
import { AgentCommandHandlers } from './Application/commands/handlers';
import { AgentQueryHandlers } from './Application/queries/handlers';
import { AgentEntityRepository } from './Domain/base-agent.entity-repo';
import { AgentNatsController } from './presentation/agent.nats-cotroller';
import { AgentService } from './Application/services/agent.service';
import { LoggerModule } from '@app/common/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),
    LoggerModule,
    CqrsModule,
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

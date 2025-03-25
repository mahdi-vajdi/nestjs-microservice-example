import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { AgentModel, AgentSchema } from './mongo/models/agent.model';
import { AGENT_PROVIDER } from './providers/agent.provider';
import { AgentMongoService } from './mongo/service/agent-mongo.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: AgentModel.name, schema: AgentSchema }]),
  ],
  providers: [
    {
      provide: AGENT_PROVIDER,
      useClass: AgentMongoService,
    },
  ],
  exports: [AGENT_PROVIDER],
})
export class DatabaseModule {}

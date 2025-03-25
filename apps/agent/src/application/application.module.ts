import { Module } from '@nestjs/common';
import { DatabaseModule } from '../infrastructure/database/database.module';
import { AgentService } from './services/agent.service';
import { AgentCommandHandlers } from './commands/handlers';
import { AgentQueryHandlers } from './queries/handlers';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule, DatabaseModule],
  providers: [AgentService, ...AgentCommandHandlers, ...AgentQueryHandlers],
  exports: [AgentService],
})
export class ApplicationModule {}

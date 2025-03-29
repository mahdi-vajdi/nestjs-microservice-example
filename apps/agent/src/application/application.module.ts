import { Module } from '@nestjs/common';
import { DatabaseModule } from '../infrastructure/database/database.module';
import { AgentService } from './services/agent.service';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule, DatabaseModule],
  providers: [AgentService],
  exports: [AgentService],
})
export class ApplicationModule {}

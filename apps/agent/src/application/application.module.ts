import { Module } from '@nestjs/common';
import { DatabaseModule } from '../infrastructure/database/database.module';
import { AgentService } from './services/agent.service';

@Module({
  imports: [DatabaseModule],
  providers: [AgentService],
  exports: [AgentService],
})
export class ApplicationModule {}

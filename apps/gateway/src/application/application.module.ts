import { Module } from '@nestjs/common';
import { CommandClientModule } from '../infrastructure/command-client/command-client.module';
import { QueryClientModule } from '../infrastructure/query-client/query-client.module';
import { AuthService } from './services/auth.service';
import { AgentService } from './services/agent.service';
import { ChannelService } from './services/channel.service';

@Module({
  imports: [CommandClientModule, QueryClientModule],
  providers: [AuthService, AgentService, ChannelService],
  exports: [AuthService, AgentService, ChannelService],
})
export class ApplicationModule {}

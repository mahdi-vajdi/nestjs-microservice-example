import { Module } from '@nestjs/common';
import { QueryClientModule } from '../infrastructure/query-client/query-client.module';
import { ChannelService } from './services/channel.service';
import { ChannelChannelHandlers } from './commands/handlers';
import { ChannelQueryHandlers } from './queries/handlers';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from '../infrastructure/database/database.module';

@Module({
  imports: [CqrsModule, QueryClientModule, DatabaseModule],
  providers: [
    ChannelService,
    ...ChannelChannelHandlers,
    ...ChannelQueryHandlers,
  ],
  exports: [ChannelService],
})
export class ApplicationModule {}

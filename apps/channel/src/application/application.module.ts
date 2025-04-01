import { Module } from '@nestjs/common';
import { QueryClientModule } from '../infrastructure/query-client/query-client.module';
import { ChannelService } from './services/channel.service';
import { DatabaseModule } from '../infrastructure/database/database.module';

@Module({
  imports: [QueryClientModule, DatabaseModule],
  providers: [ChannelService],
  exports: [ChannelService],
})
export class ApplicationModule {}

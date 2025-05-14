import { Module } from '@nestjs/common';
import { DatabaseModule } from '../infrastructure/database/database.module';
import { UserService } from './services/user.service';
import { EventPublisherModule } from '../infrastructure/event-publisher/event-publisher.module';

@Module({
  imports: [DatabaseModule, EventPublisherModule],
  providers: [UserService],
  exports: [UserService],
})
export class ApplicationModule {}

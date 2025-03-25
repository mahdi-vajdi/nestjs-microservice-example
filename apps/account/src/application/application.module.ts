import { Module } from '@nestjs/common';
import { DatabaseModule } from '../infrastructure/database/database.module';
import { AccountService } from './services/account.service';
import { AccountCommandHandlers } from './commands/handlers';
import { AccountEventHandlers } from './events/handlers';
import { AccountQueryHandlers } from './queries/handlers';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandClientModule } from '../infrastructure/command-client/command-client.module';

@Module({
  imports: [CqrsModule, DatabaseModule, CommandClientModule],
  providers: [
    AccountService,
    ...AccountCommandHandlers,
    ...AccountEventHandlers,
    ...AccountQueryHandlers,
  ],
  exports: [AccountService],
})
export class ApplicationModule {}

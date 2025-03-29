import { Module } from '@nestjs/common';
import { DatabaseModule } from '../infrastructure/database/database.module';
import { AccountService } from './services/account.service';
import { CommandClientModule } from '../infrastructure/command-client/command-client.module';

@Module({
  imports: [DatabaseModule, CommandClientModule],
  providers: [AccountService],
  exports: [AccountService],
})
export class ApplicationModule {}

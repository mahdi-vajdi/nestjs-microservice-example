import { Module } from '@nestjs/common';
import { CommandClientModule } from '../infrastructure/command-client/command-client.module';
import { QueryClientModule } from '../infrastructure/query-client/query-client.module';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

@Module({
  imports: [CommandClientModule, QueryClientModule],
  providers: [AuthService, UserService],
  exports: [AuthService, UserService],
})
export class ApplicationModule {}

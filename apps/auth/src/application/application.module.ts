import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { JwtHelperService } from './services/jwt-helper.service';
import { JwtModule } from '@nestjs/jwt';
import { CommandClientModule } from '../infrastructure/command-client/command-client.module';
import { QueryClientModule } from '../infrastructure/query-client/query-client.module';
import { DatabaseModule } from '../infrastructure/database/database.module';

@Module({
  imports: [
    JwtModule.register({}),
    CommandClientModule,
    QueryClientModule,
    DatabaseModule,
  ],
  providers: [AuthService, JwtHelperService],
  exports: [AuthService, JwtHelperService],
})
export class ApplicationModule {}

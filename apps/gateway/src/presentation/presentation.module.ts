import { AuthHttpController } from './http/controllers/auth/auth-http.controller';
import { UserHttpController } from './http/controllers/user/user.controller';
import { Module } from '@nestjs/common';
import { AccessTokenGuard } from './http/guards/access-token.guard';
import { RefreshTokenGuard } from './http/guards/refresh-token.guard';
import { CommandHandlerModule } from '../infrastructure/command-handler/command-handler.module';
import { QueryHandlerModule } from '../infrastructure/query-handler/query-handler.module';

@Module({
  imports: [CommandHandlerModule, QueryHandlerModule],
  providers: [AccessTokenGuard, RefreshTokenGuard],
  controllers: [AuthHttpController, UserHttpController],
})
export class PresentationModule {}

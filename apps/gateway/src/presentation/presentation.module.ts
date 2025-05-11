import { AuthHttpController } from './http/controllers/auth.controller';
import { UserHttpController } from './http/controllers/user.controller';
import { Module } from '@nestjs/common';
import { ApplicationModule } from '../application/application.module';
import { AccessTokenGuard } from './http/guards/access-token.guard';
import { RefreshTokenGuard } from './http/guards/refresh-token.guard';

@Module({
  imports: [ApplicationModule],
  providers: [AccessTokenGuard, RefreshTokenGuard],
  controllers: [AuthHttpController, UserHttpController],
})
export class PresentationModule {}

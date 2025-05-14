import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '../infrastructure/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { authConfig } from './configs/auth.config';

@Module({
  imports: [
    ConfigModule.forFeature(authConfig),
    JwtModule.register({}),
    DatabaseModule,
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class ApplicationModule {}

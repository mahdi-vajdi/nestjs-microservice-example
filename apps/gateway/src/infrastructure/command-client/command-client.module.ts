import { Module } from '@nestjs/common';
import { USER_WRITER } from './providers/user.writer';
import { AUTH_WRITER } from './providers/auth.writer';

@Module({
  imports: [],
  providers: [],
  exports: [USER_WRITER, AUTH_WRITER],
})
export class CommandClientModule {}

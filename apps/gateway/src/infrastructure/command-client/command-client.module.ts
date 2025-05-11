import { Module } from '@nestjs/common';
import { NatsJetStreamTransport } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { ConfigService } from '@nestjs/config';
import { USER_WRITER } from './providers/user.writer';
import { UserNatsService } from './nats/user-nats.service';
import { AUTH_WRITER } from './providers/auth.writer';
import { AuthNatsService } from './nats/auth-nats.service';

@Module({
  imports: [
    NatsJetStreamTransport.registerAsync({
      useFactory: (configService: ConfigService) => ({
        connectionOptions: {
          servers: configService.getOrThrow<string>('NATS_URI'),
          name: 'gateway-publisher',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: USER_WRITER,
      useClass: UserNatsService,
    },
    {
      provide: AUTH_WRITER,
      useClass: AuthNatsService,
    },
  ],
  exports: [USER_WRITER, AUTH_WRITER],
})
export class CommandClientModule {}

import { Module } from '@nestjs/common';
import { NatsJetStreamTransport } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { ConfigService } from '@nestjs/config';
import { USER_WRITER } from './providers/user.writer';
import { UserNatsService } from './nats/user-nats.service';

@Module({
  imports: [
    NatsJetStreamTransport.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          connectionOptions: {
            servers: configService.getOrThrow<string>('NATS_URI'),
            name: 'project-publisher',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: USER_WRITER,
      useClass: UserNatsService,
    },
  ],
  exports: [USER_WRITER],
})
export class CommandClientModule {}

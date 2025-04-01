import { Module } from '@nestjs/common';
import { NatsJetStreamTransport } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  INatsConfig,
  NATS_CONFIG_TOKEN,
  natsConfig,
} from '@app/common/nats/nats.config';
import { AccountNatsService } from './nats/account-nats.service';
import { USER_WRITER } from './providers/user.writer';
import { UserNatsService } from './nats/user.nats.service';
import { ACCOUNT_WRITER } from './providers/account.writer';

@Module({
  imports: [
    NatsJetStreamTransport.registerAsync({
      useFactory: (configService: ConfigService) => {
        const natsConfig = configService.get<INatsConfig>(NATS_CONFIG_TOKEN);

        return {
          connectionOptions: {
            servers: natsConfig.url,
            name: 'auth-publisher',
          },
        };
      },
      imports: [ConfigModule.forFeature(natsConfig)],
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: ACCOUNT_WRITER,
      useClass: AccountNatsService,
    },
    {
      provide: USER_WRITER,
      useClass: UserNatsService,
    },
  ],
  exports: [ACCOUNT_WRITER, USER_WRITER],
})
export class CommandClientModule {}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ACCOUNT_DB_COLLECTION,
  AccountSchema,
} from './Infrastructure/models/account.model';
import { CqrsModule } from '@nestjs/cqrs';
import { AccountCommandHandlers } from './Application/commands/handlers';
import { AccountQueryHandlers } from './Application/queries/handlers';
import { AccountEventHandlers } from './Application/events/handlers';
import { AccountQueryRepository } from './Infrastructure/repositories/account.query-repo';
import { AccountEntityRepositoryImpl } from './Infrastructure/repositories/impl-account.entity-repo';
import { AccountEntityRepository } from './Domain/base-account.entity-repo';
import { NatsJetStreamTransport } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { AccountService } from './Application/services/account.service';
import { LoggerModule } from '@app/common/logger/logger.module';
import { AccountNatsController } from './presentation/nats/account.nats-controller';
import { AccountGrpcController } from './presentation/grpc/account-grpc.controller';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),
    LoggerModule,
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: ACCOUNT_DB_COLLECTION, schema: AccountSchema },
    ]),
    NatsJetStreamTransport.registerAsync({
      useFactory: (configService: ConfigService) => {
        console.log(`nats uri ${configService.getOrThrow<string>('NATS_URI')}`);
        return {
          connectionOptions: {
            servers: configService.getOrThrow<string>('NATS_URI'),
            name: 'account-publisher',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AccountNatsController, AccountGrpcController],
  providers: [
    AccountService,
    AccountQueryRepository,
    { provide: AccountEntityRepository, useClass: AccountEntityRepositoryImpl },
    ...AccountCommandHandlers,
    ...AccountEventHandlers,
    ...AccountQueryHandlers,
  ],
})
export class AppModule {}

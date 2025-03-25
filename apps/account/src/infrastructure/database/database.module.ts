import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import {
  ACCOUNT_DB_COLLECTION,
  AccountSchema,
} from './mongo/models/account.model';
import { ACCOUNT_PROVIDER } from './providers/account.provider';
import { AccountMongoService } from './mongo/services/account-mongo.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: ACCOUNT_DB_COLLECTION, schema: AccountSchema },
    ]),
  ],
  providers: [{ provide: ACCOUNT_PROVIDER, useClass: AccountMongoService }],
  exports: [ACCOUNT_PROVIDER],
})
export class DatabaseModule {}

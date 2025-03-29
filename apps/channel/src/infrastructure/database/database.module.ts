import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import {
  CHANNEL_DB_COLLECTION,
  ChannelSchema,
} from './mongo/models/channel.model';
import { CHANNEL_PROVIDER } from './providers/channel.provider';
import { ChannelMongoService } from './mongo/services/channel-mongo.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: CHANNEL_DB_COLLECTION, schema: ChannelSchema },
    ]),
  ],
  providers: [{ provide: CHANNEL_PROVIDER, useClass: ChannelMongoService }],
  exports: [CHANNEL_PROVIDER],
})
export class DatabaseModule {}

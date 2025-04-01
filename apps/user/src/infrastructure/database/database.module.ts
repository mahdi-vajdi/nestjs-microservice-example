import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { UserModel, UserSchema } from './mongo/models/user.model';
import { USER_PROVIDER } from './providers/user.provider';
import { UserMongoService } from './mongo/service/user-mongo.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
  ],
  providers: [
    {
      provide: USER_PROVIDER,
      useClass: UserMongoService,
    },
  ],
  exports: [USER_PROVIDER],
})
export class DatabaseModule {}

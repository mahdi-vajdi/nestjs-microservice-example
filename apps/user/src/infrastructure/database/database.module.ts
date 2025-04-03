import { Module } from '@nestjs/common';
import { UserModel, UserSchema } from './mongo/models/user.model';
import { USER_PROVIDER } from '../../domain/repositories/user.provider';
import { UserMongoService } from './mongo/service/user-mongo.service';
import { DatabaseModule as CoreDatabaseModule } from '@app/infrastructure/database/database.module';
import { DatabaseType } from '@app/infrastructure/database/database-type.enum';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    CoreDatabaseModule.register(DatabaseType.MONGO),
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

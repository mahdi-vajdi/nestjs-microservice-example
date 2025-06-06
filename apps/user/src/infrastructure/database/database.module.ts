import { Module } from '@nestjs/common';
import { UserModel, UserSchema } from './mongo/schemas/user.schema';
import { USER_REPOSITORY } from '../../domain/ports/repositories/user-repository.interface';
import { UserMongoRepository } from './mongo/repository/user-mongo.repository';
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
      provide: USER_REPOSITORY,
      useClass: UserMongoRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class DatabaseModule {}

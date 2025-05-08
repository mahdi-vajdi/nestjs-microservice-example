import { Module } from '@nestjs/common';
import { DatabaseModule as CoreDatabaseModule } from '@app/infrastructure/database/database.module';
import { DatabaseType } from '@app/infrastructure/database/database-type.enum';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RefreshTokenModel,
  RefreshTokenSchema,
} from './mongo/schemas/refresh-token.schema';
import { AUTH_REPOSITORY } from '../../domain/repositories/auth.repository';
import { AuthMongoRepository } from './mongo/repository/auth-mongo.repository';
import {
  CredentialModel,
  CredentialSchema,
} from './mongo/schemas/credential.schema';

@Module({
  imports: [
    CoreDatabaseModule.register(DatabaseType.MONGO),
    MongooseModule.forFeature([
      { name: RefreshTokenModel.name, schema: RefreshTokenSchema },
      { name: CredentialModel.name, schema: CredentialSchema },
    ]),
  ],
  providers: [
    {
      provide: AUTH_REPOSITORY,
      useClass: AuthMongoRepository,
    },
  ],
  exports: [AUTH_REPOSITORY],
})
export class DatabaseModule {}

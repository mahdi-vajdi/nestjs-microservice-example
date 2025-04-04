import { Module } from '@nestjs/common';
import { DatabaseModule as CoreDatabaseModule } from '@app/infrastructure/database/database.module';
import { DatabaseType } from '@app/infrastructure/database/database-type.enum';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RefreshTokenModel,
  RefreshTokenSchema,
} from './mongo/models/refresh-token.model';
import { AUTH_PROVIDER } from '../../domain/repositories/auth.provider';
import { AuthMongoService } from './mongo/service/auth-mongo.service';

@Module({
  imports: [
    CoreDatabaseModule.register(DatabaseType.MONGO),
    MongooseModule.forFeature([
      { name: RefreshTokenModel.name, schema: RefreshTokenSchema },
    ]),
  ],
  providers: [
    {
      provide: AUTH_PROVIDER,
      useClass: AuthMongoService,
    },
  ],
  exports: [AUTH_PROVIDER],
})
export class DatabaseModule {}

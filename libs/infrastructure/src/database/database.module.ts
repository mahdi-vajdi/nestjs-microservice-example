import { DynamicModule, Module } from '@nestjs/common';
import { DatabaseType } from '@app/infrastructure/database/database-type.enum';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MONGO_CONFIG_TOKEN, MongoConfig, mongoConfig } from '@app/infrastructure/database/mongo/mongo.config';

@Module({})
export class DatabaseModule {
  static register(...dbs: DatabaseType[]): DynamicModule {
    const mongoImport = MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const config = configService.get<MongoConfig>(MONGO_CONFIG_TOKEN);
        return {
          uri: config.uri,
        };
      },
      inject: [ConfigService],
      imports: [ConfigModule.forFeature(mongoConfig)],
    });

    const imports = [];

    if (dbs.includes(DatabaseType.MONGO)) imports.push(mongoImport);

    return {
      module: DatabaseModule,
      imports: imports,
    };
  }
}
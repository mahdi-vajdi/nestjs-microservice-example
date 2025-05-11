import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProjectModel, ProjectSchema } from './mongo/models/project.schema';
import { ProjectMongoService } from './mongo/repositories/project-mongo.service';
import { PROJECT_REPOSITORY } from '../../domain/repositories/project.repository';
import {
  ProjectMemberModel,
  ProjectMemberSchema,
} from './mongo/models/project-member.schema';
import {
  MONGO_CONFIG_TOKEN,
  mongoConfig,
  MongoConfig,
} from '@app/infrastructure/database/mongo/mongo.config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const config = configService.get<MongoConfig>(MONGO_CONFIG_TOKEN);
        return {
          uri: config.uri,
        };
      },
      inject: [ConfigService],
      imports: [ConfigModule.forFeature(mongoConfig)],
    }),
    MongooseModule.forFeature([
      { name: ProjectModel.name, schema: ProjectSchema },
      { name: ProjectMemberModel.name, schema: ProjectMemberSchema },
    ]),
  ],
  providers: [{ provide: PROJECT_REPOSITORY, useClass: ProjectMongoService }],
  exports: [PROJECT_REPOSITORY],
})
export class DatabaseModule {}

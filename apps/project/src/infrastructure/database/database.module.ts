import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { ProjectModel, ProjectSchema } from './mongo/models/project.model';
import { PROJECT_PROVIDER } from './providers/project.provider';
import { ProjectMongoService } from './mongo/services/project-mongo.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: ProjectModel.name, schema: ProjectSchema },
    ]),
  ],
  providers: [{ provide: PROJECT_PROVIDER, useClass: ProjectMongoService }],
  exports: [PROJECT_PROVIDER],
})
export class DatabaseModule {}

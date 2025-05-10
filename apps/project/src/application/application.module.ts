import { Module } from '@nestjs/common';
import { DatabaseModule } from '../infrastructure/database/database.module';
import { ProjectService } from './services/project.service';
import { CommandClientModule } from '../infrastructure/command-client/command-client.module';

@Module({
  imports: [DatabaseModule, CommandClientModule],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ApplicationModule {}

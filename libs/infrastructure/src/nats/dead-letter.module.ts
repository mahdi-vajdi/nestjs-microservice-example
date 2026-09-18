import { Module } from '@nestjs/common';

import { DeadLetterAdvisoryService } from './dead-letter.service';

@Module({
  providers: [DeadLetterAdvisoryService],
  exports: [DeadLetterAdvisoryService],
})
export class DeadLetterModule {}

import { Controller, Logger, Param, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';

import { SseService } from '../../services/sse.service';

@Controller('notifications')
export class NotificationSseController {
  private readonly logger = new Logger(NotificationSseController.name);

  constructor(private readonly sseService: SseService) {}

  @Sse('sse/:userId')
  sse(@Param('userId') userId: string): Observable<MessageEvent> {
    this.logger.log(`Client connected for user: ${userId}`);
    return this.sseService.subscribe(userId);
  }
}

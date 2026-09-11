import { Injectable, MessageEvent } from '@nestjs/common';
import { filter, map, Observable, Subject } from 'rxjs';

@Injectable()
export class SseService {
  private eventStream = new Subject<{ userId: string; data: string | object }>();

  notifyClient(userId: string, data: string | object) {
    this.eventStream.next({ userId, data });
  }

  subscribe(userId: string): Observable<MessageEvent> {
    return this.eventStream.asObservable().pipe(
      filter((event) => event.userId === userId),
      map((event): MessageEvent => ({
        data: event.data,
      })),
    );
  }
}

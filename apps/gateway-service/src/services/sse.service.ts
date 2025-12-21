import { Injectable } from '@nestjs/common';
import { filter, map, Observable, Subject } from 'rxjs';

@Injectable()
export class SseService {
  private eventStream = new Subject<{ userId: string; data: unknown }>();

  notifyClient(userId: string, data: unknown) {
    this.eventStream.next({ userId, data });
  }

  subscribe(userId: string): Observable<MessageEvent> {
    return this.eventStream.asObservable().pipe(
      filter((event) => event.userId === userId),
      map(
        (event) =>
          ({
            data: event.data,
          }) as MessageEvent,
      ),
    );
  }
}

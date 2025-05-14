import { Injectable, Logger } from '@nestjs/common';
import { NatsJetstreamService } from '@app/common/nats/nats-jetstream.service';
import { ClientProxy } from '@nestjs/microservices';
import { NatsJetStreamClientProxy } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { ProjectEventPublisher } from '../../../domain/events/project-event.publisher';
import { Project } from '../../../domain/entities/project.entity';
import * as crypto from 'node:crypto';
import { ProjectCreatedEvent } from '@app/common/events/project/project-created.event';
import { ProjectMemberRole } from '../../../domain/enums/project-member-role.enum';

@Injectable()
export class ProjectNatsService
  extends NatsJetstreamService
  implements ProjectEventPublisher
{
  private readonly _logger = new Logger(ProjectNatsService.name);

  constructor(private readonly natsClient: NatsJetStreamClientProxy) {
    super();
  }

  get client(): ClientProxy<Record<never, Function>, string> {
    return this.natsClient;
  }

  get logger(): Logger {
    return this._logger;
  }

  get module(): string {
    return 'project-service';
  }

  async projectCreated(project: Project): Promise<void> {
    await this.emit(
      crypto.randomUUID(),
      new ProjectCreatedEvent({
        id: project.id,
        private: project.private,
        title: project.title,
        description: project.description,
        picture: project.picture,
        createdAt: project.createdAt,
        owner:
          project.members.find((m) => m.role == ProjectMemberRole.OWNER)?.id ??
          null,
      }),
    );
  }
}

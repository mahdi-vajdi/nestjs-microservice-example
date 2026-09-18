import {
  UserActivatedIntegrationEvent,
  UserCreatedIntegrationEvent,
  UserDeactivatedIntegrationEvent,
  UserPasswordChangedIntegrationEvent,
  UserRoleChangedIntegrationEvent,
} from '@app/contracts';
import {
  generateCorrelationId,
  JetStreamContext,
  runWithCorrelationId,
} from '@app/infrastructure';
import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Ctx, EventPattern, Payload } from '@nestjs/microservices';

import { SyncUserCommand } from '../../application/commands/sync-user/sync-user.command';

@Controller()
export class UserEventsNatsController {
  private readonly logger = new Logger(UserEventsNatsController.name);

  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern(UserCreatedIntegrationEvent.TOPIC)
  async handleUserCreated(
    @Payload() data: UserCreatedIntegrationEvent,
    @Ctx() ctx: JetStreamContext,
  ): Promise<void> {
    const correlationId = data.correlationId ?? generateCorrelationId();
    await runWithCorrelationId(correlationId, async () => {
      this.logger.log(
        `Received ${UserCreatedIntegrationEvent.TOPIC} for user ${data.userId} [correlationId=${correlationId}]`,
      );
      try {
        await this.commandBus.execute(
          new SyncUserCommand(data.userId, {
            action: 'CREATE',
            email: data.email,
            passwordHash: data.passwordHash,
            role: data.role,
          }),
        );
        ctx.message.ack();
      } catch (err) {
        this.logger.error(`handleUserCreated failed [correlationId=${correlationId}]`, err);
        ctx.message.nak(5_000);
      }
    });
  }

  @EventPattern(UserPasswordChangedIntegrationEvent.TOPIC)
  async handlePasswordChanged(
    @Payload() data: UserPasswordChangedIntegrationEvent,
    @Ctx() ctx: JetStreamContext,
  ): Promise<void> {
    const correlationId = data.correlationId ?? generateCorrelationId();
    await runWithCorrelationId(correlationId, async () => {
      this.logger.log(
        `Received ${UserPasswordChangedIntegrationEvent.TOPIC} for user ${data.userId} [correlationId=${correlationId}]`,
      );
      try {
        await this.commandBus.execute(
          new SyncUserCommand(data.userId, {
            action: 'CHANGE_PASSWORD',
            passwordHash: data.newPasswordHash,
          }),
        );
        ctx.message.ack();
      } catch (err) {
        this.logger.error(`handlePasswordChanged failed [correlationId=${correlationId}]`, err);
        ctx.message.nak(5_000);
      }
    });
  }

  @EventPattern(UserRoleChangedIntegrationEvent.TOPIC)
  async handleRoleChanged(
    @Payload() data: UserRoleChangedIntegrationEvent,
    @Ctx() ctx: JetStreamContext,
  ): Promise<void> {
    const correlationId = data.correlationId ?? generateCorrelationId();
    await runWithCorrelationId(correlationId, async () => {
      this.logger.log(
        `Received ${UserRoleChangedIntegrationEvent.TOPIC} for user ${data.userId} [correlationId=${correlationId}]`,
      );
      try {
        await this.commandBus.execute(
          new SyncUserCommand(data.userId, {
            action: 'CHANGE_ROLE',
            role: data.newRole,
          }),
        );
        ctx.message.ack();
      } catch (err) {
        this.logger.error(`handleRoleChanged failed [correlationId=${correlationId}]`, err);
        ctx.message.nak(5_000);
      }
    });
  }

  @EventPattern(UserDeactivatedIntegrationEvent.TOPIC)
  async handleUserDeactivated(
    @Payload() data: UserDeactivatedIntegrationEvent,
    @Ctx() ctx: JetStreamContext,
  ): Promise<void> {
    const correlationId = data.correlationId ?? generateCorrelationId();
    await runWithCorrelationId(correlationId, async () => {
      this.logger.log(
        `Received ${UserDeactivatedIntegrationEvent.TOPIC} for user ${data.userId} [correlationId=${correlationId}]`,
      );
      try {
        await this.commandBus.execute(new SyncUserCommand(data.userId, { action: 'DEACTIVATE' }));
        ctx.message.ack();
      } catch (err) {
        this.logger.error(`handleUserDeactivated failed [correlationId=${correlationId}]`, err);
        ctx.message.nak(5_000);
      }
    });
  }

  @EventPattern(UserActivatedIntegrationEvent.TOPIC)
  async handleUserActivated(
    @Payload() data: UserActivatedIntegrationEvent,
    @Ctx() ctx: JetStreamContext,
  ): Promise<void> {
    const correlationId = data.correlationId ?? generateCorrelationId();
    await runWithCorrelationId(correlationId, async () => {
      this.logger.log(
        `Received ${UserActivatedIntegrationEvent.TOPIC} for user ${data.userId} [correlationId=${correlationId}]`,
      );
      try {
        await this.commandBus.execute(new SyncUserCommand(data.userId, { action: 'ACTIVATE' }));
        ctx.message.ack();
      } catch (err) {
        this.logger.error(`handleUserActivated failed [correlationId=${correlationId}]`, err);
        ctx.message.nak(5_000);
      }
    });
  }
}

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateAgentCommand } from '../impl/create-agent.command';
import { Agent } from '../../../domain/entities/agent.entity';
import { Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import {
  AGENT_PROVIDER,
  IAgentProvider,
} from '../../../infrastructure/database/providers/agent.provider';
import { Inject } from '@nestjs/common';

@CommandHandler(CreateAgentCommand)
export class CreateAgentHandler
  implements ICommandHandler<CreateAgentCommand, void>
{
  constructor(
    @Inject(AGENT_PROVIDER) private readonly agentProvider: IAgentProvider,
  ) {}

  async execute(command: CreateAgentCommand): Promise<void> {
    const agent = Agent.create(
      new Types.ObjectId().toHexString(),
      command.requesterAccountId,
      command.email,
      command.phone,
      command.firstName,
      command.lastName,
      command.title,
      await bcrypt.hash(command.password, 10),
      null,
      command.role,
      'default',
    );

    await this.agentProvider.add(agent);
    agent.commit();
  }
}

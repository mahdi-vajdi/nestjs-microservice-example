import { Inject, Injectable, Logger } from '@nestjs/common';
import { AgentDto, AgentRole, ApiResponse } from '@app/common/dto-generic';
import { GetAccountAgentsResponse } from '@app/common/grpc/models/agent/get-account-agents.model';
import { AgentExistsResponse } from '@app/common/grpc/models/agent/agents.exists.model';
import { GetAgentIdsResponse } from '@app/common/grpc/models/agent/get-agents-ids.model';
import { GetAgentByIdResponse } from '@app/common/grpc/models/agent/get-agent-by-id.model';
import { GetAgentByEmailResponse } from '@app/common/grpc/models/agent/get-agent-by-email.model';
import { CreateOwnerAgentDto } from './dtos/create-owner-agent.dto';
import { CreateAgentDto } from './dtos/create-agent.dto';
import { UpdateRefreshTokenDto } from './dtos/update-refresh-token.dto';
import { AgentModel } from '../../infrastructure/database/mongo/models/agent.model';
import {
  AGENT_PROVIDER,
  IAgentProvider,
} from '../../infrastructure/database/providers/agent.provider';
import { Agent } from '../../domain/entities/agent.entity';
import { Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AgentService {
  private readonly logger = new Logger(AgentService.name);

  constructor(
    @Inject(AGENT_PROVIDER) private readonly agentProvider: IAgentProvider,
  ) {}

  async createOwnerAgent(
    dto: CreateOwnerAgentDto,
  ): Promise<ApiResponse<AgentDto | null>> {
    try {
      // Check if the agent already exists
      const agentExists = await this.agentProvider.agentExists(
        dto.email,
        dto.phone,
      );
      if (agentExists)
        return {
          success: false,
          error: {
            code: 409,
            message: 'The agent already exists',
          },
        };

      const agent = Agent.create(
        new Types.ObjectId().toHexString(),
        dto.accountId,
        dto.email,
        dto.phone,
        dto.firstName,
        dto.lastName,
        'Admin',
        await bcrypt.hash(dto.password, 10),
        null,
        AgentRole.OWNER,
        'default',
      );
      await this.agentProvider.add(agent);

      // Get the created agent from db
      const createdAgent = await this.agentProvider.findByEmail(dto.email);

      return {
        success: true,
        data: createdAgent ? this.toComamandDto(createdAgent) : null,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 500,
          message: error.message,
        },
      };
    }
  }

  async createAgent(
    dto: CreateAgentDto,
  ): Promise<ApiResponse<AgentDto | null>> {
    try {
      // Check if the agent already exists
      const agentExists = await this.agentProvider.agentExists(
        dto.email,
        dto.phone,
      );
      if (agentExists)
        return {
          success: false,
          error: {
            code: 409,
            message: 'The agent already exists',
          },
        };

      // Create the agent
      const agent = Agent.create(
        new Types.ObjectId().toHexString(),
        dto.accountId,
        dto.email,
        dto.phone,
        dto.firstName,
        dto.lastName,
        dto.title,
        await bcrypt.hash(dto.password, 10),
        null,
        AgentRole.OWNER,
        'default',
      );
      await this.agentProvider.add(agent);

      const createdAgent = await this.agentProvider.findByEmail(dto.email);
      return {
        success: true,
        data: createdAgent ? this.toComamandDto(createdAgent) : null,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 500,
          message: error.message,
        },
      };
    }
  }

  async updateRefreshToken({
    agentId,
    newToken,
  }: UpdateRefreshTokenDto): Promise<ApiResponse<null>> {
    try {
      const agent = await this.agentProvider.findById(agentId);
      if (!agent) return;

      agent.changeRefreshToken(newToken);
      await this.agentProvider.save(agent);

      return {
        success: true,
        data: null,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 500,
          message: error.message,
        },
      };
    }
  }

  async getAccountAgents(accountId: string): Promise<GetAccountAgentsResponse> {
    const agents = await this.agentProvider.findByAccount(accountId);

    if (agents && agents.length > 0) {
      return {
        agents: agents.map((agent) => ({
          id: agent._id.toHexString(),
          createdAt: agent.createdAt.toISOString(),
          updatedAt: agent.updatedAt.toISOString(),
          account: agent.account.toHexString(),
          email: agent.email,
          phone: agent.phone,
          firstName: agent.firstName,
          lastName: agent.lastName,
          title: agent.title,
          role: AgentRole[agent.role],
          password: agent.password,
          refreshToken: agent.refreshToken,
        })),
      };
    } else {
      return undefined;
    }
  }

  async getAgentsIds(accountId: string): Promise<GetAgentIdsResponse> {
    const agentsIds = await this.agentProvider.findIdsByAccount(accountId);
    if (agentsIds && agentsIds.length > 0) {
      return {
        agentsIds,
      };
    } else return { agentsIds: undefined };
  }

  async getById(agentId: string): Promise<GetAgentByIdResponse> {
    const agent = await this.agentProvider.findById(agentId);

    if (agent) {
      return {
        id: agent.id,
        createdAt: agent.createdAt.toISOString(),
        updatedAt: agent.updatedAt.toISOString(),
        account: agent.email,
        email: agent.email,
        phone: agent.phone,
        firstName: agent.firstName,
        lastName: agent.lastName,
        title: agent.title,
        role: AgentRole[agent.role],
        password: agent.password,
        refreshToken: agent.refreshToken,
      };
    } else {
      return undefined;
    }
  }

  async getByEmail(agentEmail: string): Promise<GetAgentByEmailResponse> {
    const agent = await this.agentProvider.findByEmail(agentEmail);

    if (agent) {
      return {
        id: agent._id.toHexString(),
        createdAt: agent.createdAt.toISOString(),
        updatedAt: agent.updatedAt.toISOString(),
        account: agent.account.toHexString(),
        email: agent.email,
        phone: agent.phone,
        firstName: agent.firstName,
        lastName: agent.lastName,
        title: agent.title,
        role: AgentRole[agent.role],
        password: agent.password,
        refreshToken: agent.refreshToken,
      };
    } else {
      return undefined;
    }
  }

  async agentExists(
    email: string,
    phone: string,
  ): Promise<AgentExistsResponse> {
    const agentExists = await this.agentProvider.agentExists(email, phone);

    if (agentExists) {
      return {
        agentExists: !!agentExists,
      };
    } else return { agentExists: undefined };
  }

  private toComamandDto(agent: AgentModel): AgentDto {
    return {
      id: agent._id.toHexString(),
      createdAt: agent.createdAt,
      updatedAt: agent.updatedAt,
      account: agent.account.toHexString(),
      email: agent.email,
      phone: agent.phone,
      firstName: agent.firstName,
      lastName: agent.lastName,
      title: agent.title,
      refreshToken: agent.refreshToken,
      role: agent.role,
      avatar: agent.avatar,
      online: agent.online,
    };
  }
}

import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { UpdateRefreshTokenDto } from '../../Application/dto/update-refresh-token.dto';
import { AgentDto, ApiResponse } from '@app/common/dto-generic';
import { AgentService } from '../../Application/services/agent.service';
import { CreateOwnerAgentRequest } from '@app/common/streams/agent/create-owner-agent.model';
import { CreateAgentRequest } from '@app/common/streams/agent/create-agent.model';
import { UpdateRefreshTokenRequest } from '@app/common/streams/agent/update-refresh-token.model';

/**
 * The controller that handles commands via NATS
 */
@Controller()
export class AgentNatsController {
  constructor(private readonly agentService: AgentService) {}

  @MessagePattern({ cmd: new CreateOwnerAgentRequest().streamKey() })
  async createOwnerAgent(
    @Payload() dto: CreateOwnerAgentRequest,
  ): Promise<ApiResponse<AgentDto | null>> {
    return await this.agentService.createOwnerAgent(dto);
  }

  @MessagePattern({ cmd: new CreateAgentRequest().streamKey() })
  async createAgent(
    @Payload() dto: CreateAgentRequest,
  ): Promise<ApiResponse<AgentDto | null>> {
    return await this.agentService.createAgent(dto);
  }

  @EventPattern(new UpdateRefreshTokenRequest().streamKey())
  async updateRefreshToken(
    @Payload() dto: UpdateRefreshTokenDto,
  ): Promise<ApiResponse<null>> {
    return await this.agentService.updateRefreshToken(dto);
  }
}

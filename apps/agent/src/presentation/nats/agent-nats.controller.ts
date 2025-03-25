import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { AgentDto, ApiResponse } from '@app/common/dto-generic';
import { AgentService } from '../../application/services/agent.service';
import { CreateOwnerAgent } from '@app/common/streams/agent/create-owner-agent.model';
import { CreateAgent } from '@app/common/streams/agent/create-agent.model';
import { UpdateRefreshToken } from '@app/common/streams/agent/update-refresh-token.model';
import { UpdateRefreshTokenDto } from '../../application/services/dtos/update-refresh-token.dto';

@Controller()
export class AgentNatsController {
  constructor(private readonly agentService: AgentService) {}

  @MessagePattern({ cmd: new CreateOwnerAgent().streamKey() })
  async createOwnerAgent(
    @Payload() dto: CreateOwnerAgent,
  ): Promise<ApiResponse<AgentDto | null>> {
    return await this.agentService.createOwnerAgent(dto);
  }

  @MessagePattern({ cmd: new CreateAgent().streamKey() })
  async createAgent(
    @Payload() dto: CreateAgent,
  ): Promise<ApiResponse<AgentDto | null>> {
    return await this.agentService.createAgent(dto);
  }

  @EventPattern(new UpdateRefreshToken().streamKey())
  async updateRefreshToken(
    @Payload() dto: UpdateRefreshTokenDto,
  ): Promise<ApiResponse<null>> {
    return await this.agentService.updateRefreshToken(dto);
  }
}

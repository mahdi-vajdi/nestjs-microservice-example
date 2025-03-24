import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Roles } from '@app/common/decorators';
import { Request } from 'express';
import { CreateAgentDto } from '../../../dto/agent/create-agent.dto';
import { AccessTokenGuard } from '../guards/access-token.guard';
import { JwtPayloadDto } from '../../../dto/auth/jwt-payload.dto';
import { AgentService } from '../../../application/services/agent.service';
import { AgentDto, AgentRole, ApiResponse } from '@app/common/dto-generic';
import { GetAccountAgentsResponse } from '@app/common/grpc/models/agent/get-account-agents.model';

@Controller('agent')
export class AgentHttpController {
  constructor(private readonly agentService: AgentService) {}

  @UseGuards(AccessTokenGuard)
  @Roles(AgentRole.OWNER)
  @Post()
  async createAgent(
    @Req() req: Request,
    @Body() dto: CreateAgentDto,
  ): Promise<ApiResponse<AgentDto | null>> {
    const jwtPaylaod = req['user'] as JwtPayloadDto;

    const res = await this.agentService.createAgent(jwtPaylaod, dto);

    return {
      data: res,
      error: null,
      success: true,
    };
  }

  @UseGuards(AccessTokenGuard)
  @Roles(AgentRole.OWNER, AgentRole.ADMIN)
  @Get()
  async getAccountAgents(
    @Req() req: Request,
  ): Promise<GetAccountAgentsResponse> {
    const jwtPaylaod = req['user'] as JwtPayloadDto;
    return await this.agentService.getAccountAgents(jwtPaylaod);
  }
}

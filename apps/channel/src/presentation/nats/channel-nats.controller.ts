import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ApiResponse } from '@app/common/dto-generic';
import { ChannelService } from '../../Application/services/channel.service';
import { ChannelModel } from '../../Infrastructure/models/channel.model';
import { CreateChannelRequest } from '@app/common/streams/channel/create-channel.model';
import { UpdateChannelAgentsRequest } from '@app/common/streams/channel/update-channel-agents.model';

@Controller()
export class ChannelNatsController {
  constructor(private readonly channelService: ChannelService) {}

  @EventPattern(new CreateChannelRequest().streamKey())
  async create(
    @Payload() dto: CreateChannelRequest,
  ): Promise<ApiResponse<ChannelModel | null>> {
    return await this.channelService.create(dto);
  }

  @EventPattern(new UpdateChannelAgentsRequest().streamKey())
  async updateChannelAgents(
    @Payload() dto: UpdateChannelAgentsRequest,
  ): Promise<ApiResponse<boolean>> {
    return await this.channelService.updateAgentsList(dto);
  }
}

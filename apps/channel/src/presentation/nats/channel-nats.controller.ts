import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ApiResponse } from '@app/common/dto-generic';
import { ChannelService } from '../../application/services/channel.service';
import { ChannelModel } from '../../infrastructure/database/mongo/models/channel.model';
import { CreateChannel } from '@app/common/streams/channel/create-channel.model';
import { UpdateChannelAgents } from '@app/common/streams/channel/update-channel-agents.model';

@Controller()
export class ChannelNatsController {
  constructor(private readonly channelService: ChannelService) {}

  @EventPattern(new CreateChannel().streamKey())
  async create(
    @Payload() dto: CreateChannel,
  ): Promise<ApiResponse<ChannelModel | null>> {
    return await this.channelService.create(dto);
  }

  @EventPattern(new UpdateChannelAgents().streamKey())
  async updateChannelAgents(
    @Payload() dto: UpdateChannelAgents,
  ): Promise<ApiResponse<boolean>> {
    return await this.channelService.updateAgentsList(dto);
  }
}

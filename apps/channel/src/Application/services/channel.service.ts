import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateChannelDto } from '../dto/create-channel.dto';
import { CreateChannelCommand } from '../commands/impl/create-channel.command';
import { lastValueFrom } from 'rxjs';
import { ApiResponse } from '@app/common/dto-generic';
import { ClientGrpc } from '@nestjs/microservices';
import { GetChannelByIdQuery } from '../queries/impl/get-by-id.query';
import { ChannelModel } from '../../Infrastructure/models/channel.model';
import { UpdateChannelAgentsDto } from '../dto/update-channel-agents.dto';
import { UpdateChannelAgentsCommand } from '../commands/impl/update-channel-agents';
import { GetAccountChannelsQuery } from '../queries/impl/get-account-cahnnels.query';
import { IAgentGrpcService } from '@app/common/grpc/interfaces/agent.interface';
import { ChannelMessage } from '@app/common/grpc/models/channel/channel-message.dto';
import { GetChannelByIdResponse } from '@app/common/grpc/models/channel/get-channel-by-id.dto';
import { GetAccountChannelsResponse } from '@app/common/grpc/models/channel/get-account-channels-request.dto';
import { AGENT_GRPC_CLIENT_PROVIDER } from '@app/common/grpc/options/agent.options';

@Injectable()
export class ChannelService implements OnModuleInit {
  private readonly logger = new Logger(ChannelService.name);
  private agentQueryService: IAgentGrpcService;

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @Inject(AGENT_GRPC_CLIENT_PROVIDER)
    private readonly agentGrpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.agentQueryService =
      this.agentGrpcClient.getService<IAgentGrpcService>('AgentService');
  }

  async create(
    dto: CreateChannelDto,
  ): Promise<ApiResponse<ChannelModel | null>> {
    try {
      // Get agents ids if caller wants
      const agents: string[] = [];
      if (dto.addAllAgents) {
        const res = await this.agentQueryService.getAgentsIds({
          accountId: dto.accountId,
        });
        const { agentsIds } = await lastValueFrom(res);
        if (agentsIds) agents.push(...agentsIds);
      }

      const channelId = await this.commandBus.execute<
        CreateChannelCommand,
        string
      >(
        new CreateChannelCommand(
          dto.accountId,
          dto.title,
          dto.url,
          crypto.randomUUID(),
          agents,
        ),
      );

      const channel = await this.queryBus.execute<
        GetChannelByIdQuery,
        ChannelModel | null
      >(new GetChannelByIdQuery(dto.accountId, channelId));

      return {
        success: true,
        data: channel,
      };
    } catch (error) {
      this.logger.error(error.message, {
        function: 'create',
        date: new Date(),
        data: dto,
      });

      return {
        success: false,
        error: {
          code: 500,
          message: error.message,
        },
      };
    }
  }

  async updateAgentsList(
    dto: UpdateChannelAgentsDto,
  ): Promise<ApiResponse<boolean>> {
    try {
      await this.commandBus.execute<UpdateChannelAgentsCommand, boolean>(
        new UpdateChannelAgentsCommand(
          dto.requesterAccountId,
          dto.channelId,
          dto.agents,
        ),
      );

      return {
        success: true,
        data: true,
      };
    } catch (error) {
      this.logger.error(error.message, {
        function: 'updateAgentsList',
        date: new Date(),
        data: dto,
      });

      return {
        success: false,
        error: {
          code: 500,
          message: error.message,
        },
      };
    }
  }

  async getAccountChannels(
    accountId: string,
  ): Promise<GetAccountChannelsResponse> {
    const channels = await this.queryBus.execute<
      GetAccountChannelsQuery,
      ChannelModel[] | null
    >(new GetAccountChannelsQuery(accountId));

    if (channels)
      return {
        channels: channels.map((channel) => this.toQueryModel(channel)),
      };
    else return { channels: undefined };
  }

  async getById(
    accountId: string,
    channelId: string,
  ): Promise<GetChannelByIdResponse> {
    const channel = await this.queryBus.execute<
      GetChannelByIdQuery,
      ChannelModel
    >(new GetChannelByIdQuery(accountId, channelId));

    if (channel) this.toQueryModel(channel);
    else {
      return undefined;
    }
  }

  private toQueryModel(channel: ChannelModel): ChannelMessage {
    const { settings } = channel;

    return {
      id: channel._id.toHexString(),
      createdAt: channel.createdAt.toISOString(),
      updatedAt: channel.updatedAt.toISOString(),
      account: channel.account.toHexString(),
      title: channel.title,
      url: channel.url,
      token: channel.token,
      isEnabled: channel.isEnabled,
      agents: channel.agents.map((agent) => agent.toHexString()),
      channelSettings: {
        Main: { ...settings.main, InfoForm: settings.main.infoForm },
        WidgetLandings: settings.widgetLandings,
        WidgetCustomization: settings.widgetCustomization,
        WidgetDisplay: settings.widgetDisplay,
        WidgetPosition: settings.widgetPosition,
      },
    };
  }
}

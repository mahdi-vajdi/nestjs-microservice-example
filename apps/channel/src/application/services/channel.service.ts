import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateChannelDto } from '../dto/create-channel.dto';
import { ApiResponse } from '@app/common/dto-generic';
import { ChannelModel } from '../../infrastructure/database/mongo/models/channel.model';
import { UpdateChannelUsersDto } from '../dto/update-channel-users.dto';
import { ChannelMessage } from '@app/common/grpc/models/channel/channel-message.dto';
import { GetChannelByIdResponse } from '@app/common/grpc/models/channel/get-channel-by-id.dto';
import { GetAccountChannelsResponse } from '@app/common/grpc/models/channel/get-account-channels-request.dto';
import {
  IUserReader,
  USER_READER,
} from '../../infrastructure/query-client/providers/user.reader';
import { Channel } from '../../domain/entities/channel.entity';
import { Types } from 'mongoose';
import {
  CHANNEL_PROVIDER,
  IChannelProvider,
} from '../../infrastructure/database/providers/channel.provider';

@Injectable()
export class ChannelService {
  private readonly logger = new Logger(ChannelService.name);

  constructor(
    @Inject(CHANNEL_PROVIDER)
    private readonly channelProvider: IChannelProvider,
    @Inject(USER_READER) private readonly userReader: IUserReader,
  ) {}

  async create(
    dto: CreateChannelDto,
  ): Promise<ApiResponse<ChannelModel | null>> {
    try {
      // Get suers ids if caller wants
      const users: string[] = [];
      if (dto.addAllUsers) {
        const userIds = await this.userReader.getAccountUserIds(dto.accountId);
        if (userIds) users.push(...userIds);
      }

      const channel = Channel.create(
        new Types.ObjectId().toHexString(),
        dto.accountId,
        dto.title,
        dto.url,
        crypto.randomUUID(),
        users,
      );

      const createdChannel = await this.channelProvider.add(channel);

      return {
        success: true,
        data: createdChannel,
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

  async updateUsersList(
    dto: UpdateChannelUsersDto,
  ): Promise<ApiResponse<boolean>> {
    try {
      const channel = await this.channelProvider.findById(dto.channelId);

      if (!channel || channel.account !== dto.requesterAccountId)
        throw new Error('There is no channel or the channld Id does not match');

      if (channel && channel.account === dto.requesterAccountId)
        channel.updateUsers(dto.users);

      await this.channelProvider.save(channel);

      return {
        success: true,
        data: true,
      };
    } catch (error) {
      this.logger.error(error.message, {
        function: 'updateUsersList',
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
    const channels = await this.channelProvider.findByAccount(accountId);

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
    const channel = await this.channelProvider.findOneById(
      accountId,
      channelId,
    );

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
      users: channel.users.map((user) => user.toHexString()),
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

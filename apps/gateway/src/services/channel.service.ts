import { NatsJetStreamClientProxy } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { JwtPayloadDto } from '../dto/auth/jwt-payload.dto';
import { CreateChannelDto } from '../dto/channel/create-channel.dto';
import { UpdateChannelAgentsDto } from '../dto/channel/update-channel-agents.dto';
import { IChannelGrpcService } from '@app/common/grpc/interfaces/channel.interface';
import {
  CHANNEL_GRPC_CLIENT_PROVIDER,
  CHANNEL_GRPC_SERVICE_NAME,
} from '@app/common/grpc/configs/channel-grpc.config';
import { CreateChannelRequest } from '@app/common/streams/channel/create-channel.model';
import { UpdateChannelAgentsRequest } from '@app/common/streams/channel/update-channel-agents.model';

@Injectable()
export class ChannelService implements OnModuleInit {
  queryService: IChannelGrpcService;

  constructor(
    @Inject(CHANNEL_GRPC_CLIENT_PROVIDER)
    private readonly grpcClient: ClientGrpc,
    private readonly natsClient: NatsJetStreamClientProxy,
  ) {}

  onModuleInit() {
    this.queryService = this.grpcClient.getService<IChannelGrpcService>(
      CHANNEL_GRPC_SERVICE_NAME,
    );
  }

  async create(user: JwtPayloadDto, dto: CreateChannelDto) {
    await lastValueFrom(
      this.natsClient.emit<void>(new CreateChannelRequest().streamKey(), {
        accountId: user.account,
        ...dto,
      }),
    );
  }

  async updateAgents(
    user: JwtPayloadDto,
    channelId: string,
    dto: UpdateChannelAgentsDto,
  ) {
    await lastValueFrom(
      this.natsClient.emit<void>(new UpdateChannelAgentsRequest().streamKey(), {
        requesterAccountId: user.account,
        channelId,
        ...dto,
      }),
    );
  }

  getById(user: JwtPayloadDto, channelId: string) {
    return this.queryService.getChannelById({
      accountId: user.account,
      channelId: channelId,
    });
  }

  getAccountChannels(user: JwtPayloadDto) {
    return this.queryService.getAccountChannels({
      accountId: user.account,
    });
  }
}

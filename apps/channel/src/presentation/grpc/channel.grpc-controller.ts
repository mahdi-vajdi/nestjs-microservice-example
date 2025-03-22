import { GrpcMethod } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { ChannelService } from '../../Application/services/channel.service';
import { IChannelGrpcService } from '@app/common/grpc/interfaces/channel.interface';
import {
  GetChannelByIdRequest,
  GetChannelByIdResponse,
} from '@app/common/grpc/models/channel/get-channel-by-id.dto';
import {
  GetAccountChannelsRequest,
  GetAccountChannelsResponse,
} from '@app/common/grpc/models/channel/get-account-channels-request.dto';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { CHANNEL_GRPC_SERVICE_NAME } from '@app/common/grpc/configs/channel-grpc.config';

@Controller()
export class ChannelGrpcController implements IChannelGrpcService {
  constructor(private readonly channelService: ChannelService) {}

  @GrpcMethod(CHANNEL_GRPC_SERVICE_NAME, 'GetAccountChannels')
  async getAccountChannels(
    req: GetAccountChannelsRequest,
  ): Promise<Observable<GetAccountChannelsResponse>> {
    return of(await this.channelService.getAccountChannels(req.accountId));
  }

  @GrpcMethod(CHANNEL_GRPC_SERVICE_NAME, 'GetChannelById')
  async getChannelById(
    req: GetChannelByIdRequest,
  ): Promise<Observable<GetChannelByIdResponse>> {
    return of(await this.channelService.getById(req.accountId, req.channelId));
  }
}

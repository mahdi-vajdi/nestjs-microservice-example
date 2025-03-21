import { Observable } from 'rxjs/internal/Observable';
import { GetChannelByIdRequest, GetChannelByIdResponse } from '@app/common/grpc/models/channel/get-channel-by-id.dto';
import {
  GetAccountChannelsRequest,
  GetAccountChannelsResponse,
} from '@app/common/grpc/models/channel/get-account-channels-request.dto';

export interface IChannelGrpcService {
  getAccountChannels(
    req: GetAccountChannelsRequest,
  ): Promise<Observable<GetAccountChannelsResponse>>;

  getChannelById(
    req: GetChannelByIdRequest,
  ): Promise<Observable<GetChannelByIdResponse>>;
}

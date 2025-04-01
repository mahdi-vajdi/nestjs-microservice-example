import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { ApiResponse, UserDto } from '@app/common/dto-generic';
import { UserService } from '../../application/services/user.service';
import { CreateOwnerUser } from '@app/common/streams/user/create-owner-user.model';
import { CreateUser } from '@app/common/streams/user/create-user.model';
import { UpdateRefreshToken } from '@app/common/streams/user/update-refresh-token.model';
import { UpdateRefreshTokenDto } from '../../application/services/dtos/update-refresh-token.dto';

@Controller()
export class UserNatsController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: new CreateOwnerUser().streamKey() })
  async createOwnerUser(
    @Payload() dto: CreateOwnerUser,
  ): Promise<ApiResponse<UserDto | null>> {
    return await this.userService.createOwnerUser(dto);
  }

  @MessagePattern({ cmd: new CreateUser().streamKey() })
  async createUser(
    @Payload() dto: CreateUser,
  ): Promise<ApiResponse<UserDto | null>> {
    return await this.userService.createUser(dto);
  }

  @EventPattern(new UpdateRefreshToken().streamKey())
  async updateRefreshToken(
    @Payload() dto: UpdateRefreshTokenDto,
  ): Promise<ApiResponse<null>> {
    return await this.userService.updateRefreshToken(dto);
  }
}

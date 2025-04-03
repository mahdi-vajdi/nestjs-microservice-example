import { Controller, Logger } from '@nestjs/common';
import {
  EventPattern,
  MessagePattern,
  Payload,
  RpcException,
} from '@nestjs/microservices';
import { UserDto } from '@app/common/dto-generic';
import { UserService } from '../../application/services/user.service';
import { CreateOwnerUser } from '@app/common/streams/user/create-owner-user.model';
import { CreateUser } from '@app/common/streams/user/create-user.model';
import { UpdateRefreshToken } from '@app/common/streams/user/update-refresh-token.model';
import { UpdateRefreshTokenDto } from '../../application/services/dtos/update-refresh-token.dto';
import { Result } from '@app/common/result';

@Controller()
export class UserNatsController {
  private readonly logger = new Logger(UserNatsController.name);

  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: new CreateOwnerUser().streamKey() })
  async createOwnerUser(
    @Payload() dto: CreateOwnerUser,
  ): Promise<Result<UserDto>> {
    try {
      const user = await this.userService.createOwnerUser(dto);

      return Result.ok<UserDto>({
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        account: user.admin,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        title: user.title,
        refreshToken: user.refreshToken,
        role: user.role,
        avatar: user.avatar,
        online: user.online,
      });
    } catch (error) {
      this.logger.error(
        `error in ${this.createOwnerUser.name}: ${error.message}`,
      );
      throw new RpcException(Result.error(error));
    }
  }

  @MessagePattern({ cmd: new CreateUser().streamKey() })
  async createUser(@Payload() dto: CreateUser): Promise<Result<UserDto>> {
    try {
      const user = await this.userService.createUser({
        email: dto.email,
        phone: dto.phone,
        firstName: dto.firstName,
        lastName: dto.lastName,
        title: dto.title,
        role: dto.role,
        password: dto.password,
        accountId: dto.accountId,
        channelIds: dto.channelIds,
      });

      return Result.ok<UserDto>({
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        account: user.admin,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        title: user.title,
        refreshToken: user.refreshToken,
        role: user.role,
        avatar: user.avatar,
        online: user.online,
      });
    } catch (error) {
      this.logger.error(`error in ${this.createUser.name}: ${error.message}`);
      throw new RpcException(Result.error(error));
    }
  }

  @EventPattern(new UpdateRefreshToken().streamKey())
  async updateRefreshToken(
    @Payload() dto: UpdateRefreshTokenDto,
  ): Promise<void> {
    try {
      await this.userService.updateRefreshToken(dto);
    } catch (error) {
      this.logger.error(`error in ${this.createUser.name}: ${error.message}`);
    }
  }
}

import { ParseMongoIdPipe } from '@app/common/pipes';
import { UserRole } from '@app/common/dto-generic';
import { Roles } from '@app/common/decorators';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateChannelDto } from '../../../dto/channel/create-channel.dto';
import { UpdateChannelUserDto } from '../../../dto/channel/update-channel-user.dto';
import { AccessTokenGuard } from '../guards/access-token.guard';
import { JwtPayloadDto } from '../../../dto/auth/jwt-payload.dto';
import { ChannelService } from '../../../application/services/channel.service';
import { GetAccountChannelsResponse } from '@app/common/grpc/models/channel/get-account-channels-request.dto';

@Controller('channel')
export class ChannelHttpController {
  constructor(private readonly channelService: ChannelService) {}

  @UseGuards(AccessTokenGuard)
  @Roles(UserRole.OWNER)
  @Post()
  async create(
    @Req() req: Request,
    @Body() dto: CreateChannelDto,
  ): Promise<void> {
    const jwtPaylaod = req['user'] as JwtPayloadDto;
    await this.channelService.create(jwtPaylaod, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @Get()
  async getAccountChannels(
    @Req() req: Request,
  ): Promise<GetAccountChannelsResponse> {
    const jwtPayload = req['user'] as JwtPayloadDto;
    return await this.channelService.getAccountChannels(jwtPayload);
  }

  @UseGuards(AccessTokenGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @Get(':id')
  async getChannelById(@Req() req: Request, @Param('id') channelId: string) {
    const jwtPayload = req['user'] as JwtPayloadDto;
    return this.channelService.getById(jwtPayload, channelId);
  }

  @UseGuards(AccessTokenGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @Patch(':id/users')
  async updateChannelUsers(
    @Req() req: Request,
    @Param('id', ParseMongoIdPipe) channelId: string,
    @Body() dto: UpdateChannelUserDto,
  ) {
    const jwtPaylaod = req['user'] as JwtPayloadDto;
    await this.channelService.updateUsers(jwtPaylaod, channelId, dto);
  }
}

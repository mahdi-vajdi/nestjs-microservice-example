import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Roles } from '@app/common/decorators';
import { Request } from 'express';
import { CreateUserDto } from '../../../dto/user/create-user.dto';
import { AccessTokenGuard } from '../guards/access-token.guard';
import { JwtPayloadDto } from '../../../dto/auth/jwt-payload.dto';
import { UserService } from '../../../application/services/user.service';
import { ApiResponse, UserDto, UserRole } from '@app/common/dto-generic';

@Controller('users')
export class UserHttpController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AccessTokenGuard)
  @Roles(UserRole.OWNER)
  @Post()
  async createUser(
    @Req() req: Request,
    @Body() dto: CreateUserDto,
  ): Promise<ApiResponse<UserDto | null>> {
    const jwtPaylaod = req['user'] as JwtPayloadDto;

    const res = await this.userService.createUser(jwtPaylaod, dto);

    return {
      data: res,
      error: null,
      success: true,
    };
  }
}

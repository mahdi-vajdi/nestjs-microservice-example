import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiResponse, UserDto } from '@app/common/dto-generic';
import { ProjectService } from '../../application/services/project.service';
import { CreateAccount } from '@app/common/streams/account/create-account.model';

@Controller()
export class ProjectNatsController {
  constructor(private readonly accountService: ProjectService) {}

  @MessagePattern({ cmd: new CreateAccount().streamKey() })
  async createAccount(
    @Payload() dto: CreateAccount,
  ): Promise<ApiResponse<UserDto | null>> {
    return await this.accountService.createAccount(dto);
  }
}

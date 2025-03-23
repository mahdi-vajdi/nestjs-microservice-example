import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AgentDto, ApiResponse } from '@app/common/dto-generic';
import { AccountService } from '../../Application/services/account.service';
import { CreateAccountRequest } from '@app/common/streams/account/create-account.model';

@Controller()
export class AccountNatsController {
  constructor(private readonly accountService: AccountService) {}

  @MessagePattern({ cmd: new CreateAccountRequest().streamKey() })
  async createAccount(
    @Payload() dto: CreateAccountRequest,
  ): Promise<ApiResponse<AgentDto | null>> {
    return await this.accountService.createAccount(dto);
  }
}

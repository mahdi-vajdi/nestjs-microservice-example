import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AgentDto, ApiResponse } from '@app/common/dto-generic';
import { AccountService } from '../../Application/services/account.service';
import { CreateAccount } from '@app/common/streams/account/create-account.model';

@Controller()
export class AccountNatsController {
  constructor(private readonly accountService: AccountService) {}

  @MessagePattern({ cmd: new CreateAccount().streamKey() })
  async createAccount(
    @Payload() dto: CreateAccount,
  ): Promise<ApiResponse<AgentDto | null>> {
    return await this.accountService.createAccount(dto);
  }
}

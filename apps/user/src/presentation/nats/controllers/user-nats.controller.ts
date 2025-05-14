import { Controller, Logger } from '@nestjs/common';
import { UserService } from '../../../application/services/user.service';

@Controller()
export class UserNatsController {
  private readonly logger = new Logger(UserNatsController.name);

  constructor(private readonly userService: UserService) {}
}

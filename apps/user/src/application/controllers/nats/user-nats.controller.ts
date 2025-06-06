import { Controller, Logger } from '@nestjs/common';

@Controller()
export class UserNatsController {
  private readonly logger = new Logger(UserNatsController.name);

  constructor() {}
}

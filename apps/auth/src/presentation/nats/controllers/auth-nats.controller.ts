import { Controller } from '@nestjs/common';
import { AuthService } from '../../../application/services/auth.service';

@Controller()
export class AuthNatsController {
  constructor(private readonly authService: AuthService) {}
}

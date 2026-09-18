import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PasswordVerifierPort } from '../../domain';

@Injectable()
export class BcryptPasswordVerifier implements PasswordVerifierPort {
  async verify(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}

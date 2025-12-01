import { Module } from '@nestjs/common';
import { IdentityModule } from '@app/identity';

@Module({
  imports: [IdentityModule],
  controllers: [],
  providers: [],
})
export class IdentityServiceModule {}

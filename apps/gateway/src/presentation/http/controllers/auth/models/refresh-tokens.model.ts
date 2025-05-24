import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokensResponse {
  @ApiProperty()
  refreshToken: string;
  
  @ApiProperty()
  accessToken: string;
}

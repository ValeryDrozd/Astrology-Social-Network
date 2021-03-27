import { Injectable } from '@nestjs/common';

@Injectable()
export class AccessTokensService {
  generateAccessToken(userID: string): void {}
}

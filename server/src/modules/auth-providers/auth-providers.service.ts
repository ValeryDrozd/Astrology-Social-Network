import { Injectable } from '@nestjs/common';
import { PgService } from '../pg/pg.service';
import AuthProviderDTO, { AuthProviderName } from './dto/auth-provider.dto';

@Injectable()
export class AuthProvidersService {
  private tableName = 'AuthProviders';
  constructor(private pgService: PgService) {}

  async saveProvider(provider: AuthProviderDTO): Promise<void> {
    await this.pgService.create({ values: [provider], tableName: this.tableName });
  }

  async findOne(userID: string, authName: AuthProviderName): Promise<AuthProviderDTO> {
    return await this.pgService.findOne({
      tableName: this.tableName,
      where: { userID, authName },
    });
  }
}

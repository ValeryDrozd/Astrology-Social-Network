import { AuthProviderName } from '@interfaces/user';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PgService } from '../pg/pg.service';
import AuthProviderDTO from './dto/auth-provider.dto';

@Injectable()
export class AuthProvidersService {
  private tableName = 'AuthProviders';
  constructor(private pgService: PgService) {}

  async saveProvider(provider: AuthProviderDTO): Promise<void> {
    await this.pgService.create({ values: [provider], tableName: this.tableName });
  }

  async findOne(userID: string, authName: AuthProviderName): Promise<AuthProviderDTO> {
    const res = await this.pgService.findOne<AuthProviderDTO>({
      tableName: this.tableName,
      where: { userID, authName },
    });
    if (!res) {
      throw new NotFoundException();
    }

    return res;
  }

  async find(userID: string): Promise<AuthProviderDTO[]> {
    return await this.pgService.find<AuthProviderDTO>({
      tableName: this.tableName,
      where: { userID },
    });
  }

  async changePassword(userID: string, password: string): Promise<void> {
    await this.pgService.update({
      tableName: this.tableName,
      updates: { password },
      where: { userID, authName: 'local' },
    });
  }
}

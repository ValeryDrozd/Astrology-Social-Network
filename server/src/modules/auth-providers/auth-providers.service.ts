import { Injectable } from '@nestjs/common';
import { PgService } from '../pg/pg.service';
import AuthProviderDTO from './dto/auth-provider.dto';

@Injectable()
export class AuthProvidersService {
  private tableName = 'AuthProviders';
  constructor(private pgService: PgService) {}

  async saveProvider(provider: AuthProviderDTO): Promise<void> {
    await this.pgService.create({ values: [provider], tableName: this.tableName });
  }
}

import { Injectable } from '@nestjs/common';
import { PgService } from '../pg/pg.service';
import RefreshSessionDTO from './dto/refresh-session.dto';

@Injectable()
export class RefreshSessionsService {
  private tableName = 'RefreshSessions';
  constructor(private pgService: PgService) {}

  async saveSession(session: RefreshSessionDTO): Promise<void> {
    await this.pgService.create({ tableName: this.tableName, values: [session] });
  }
}

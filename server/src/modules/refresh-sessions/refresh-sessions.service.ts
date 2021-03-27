import { Injectable } from '@nestjs/common';
import { PgService } from '../pg/pg.service';
import Session from './dto/refresh-session.dto';

@Injectable()
export class RefreshSessionsService {
  private tableName = 'RefreshSessions';
  constructor(private pgService: PgService) {}

  async saveSession(session: Session): Promise<void> {
    await this.pgService.create({ tableName: this.tableName, values: [session] });
  }

  async findOne(refreshToken: string): Promise<Session> {
    return await this.pgService.findOne({
      tableName: this.tableName,
      where: { refreshToken },
    });
  }

  async delete(refreshToken: string): Promise<void> {
    await this.pgService.delete({ tableName: this.tableName, where: { refreshToken } });
  }
}

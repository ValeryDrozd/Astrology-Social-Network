import { Module } from '@nestjs/common';
import { PgService } from '../pg/pg.service';
import { RefreshSessionsService } from './refresh-sessions.service';

@Module({
  providers: [RefreshSessionsService, PgService],
})
export class RefreshSessionsModule {}

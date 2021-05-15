import { Module } from '@nestjs/common';
import { PgService } from '../pg/pg.service';
import { AuthProvidersService } from './auth-providers.service';

@Module({
  providers: [AuthProvidersService, PgService],
})
export class AuthProvidersModule {}

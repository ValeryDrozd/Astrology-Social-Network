import { Module } from '@nestjs/common';
import { PgService } from '../pg/pg.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PgService],
})
export class UsersModule {}

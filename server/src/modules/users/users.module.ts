import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { JwtStrategy } from '../auth/strateries/jwt.strategy';
import { PgService } from '../pg/pg.service';
import { ZodiacSignsService } from '../zodiac-signs/zodiac-signs.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [UsersService, PgService, JwtStrategy],
  exports: [UsersService],
})
export class UsersModule {}

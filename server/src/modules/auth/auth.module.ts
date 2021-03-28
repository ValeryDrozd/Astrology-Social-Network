import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ScryptService } from '../scrypt/scrypt.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strateries/jwt.strategy';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { PgService } from '../pg/pg.service';
import { RefreshSessionsService } from '../refresh-sessions/refresh-sessions.service';
import { AuthProvidersService } from '../auth-providers/auth-providers.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30m' },
    }),
  ],
  providers: [
    AuthService,
    ScryptService,
    UsersService,
    PgService,
    JwtStrategy,
    RefreshSessionsService,
    AuthProvidersService,
  ],
  controllers: [AuthController],
  exports: [
    AuthService,
    ScryptService,
    UsersService,
    PgService,
    JwtModule,
    JwtStrategy,
    RefreshSessionsService,
    AuthProvidersService,
  ],
})
export class AuthModule {}

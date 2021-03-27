import { Injectable } from '@nestjs/common';
import { ScryptService } from '../scrypt/scrypt.service';
import { v4 as uuid } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import RegisterDTO from './dto/register.dto';
import { RefreshSessionsService } from '../refresh-sessions/refresh-sessions.service';
import { AuthProvidersService } from '../auth-providers/auth-providers.service';
import { AuthProviderName } from '../auth-providers/dto/auth-provider.dto';

@Injectable()
export class AuthService {
  constructor(
    private scryptService: ScryptService,
    private jwtService: JwtService,
    private usersService: UsersService,
    private refreshSessionsService: RefreshSessionsService,
    private authProvidersService: AuthProvidersService,
  ) {}

  async register(
    { password: pass, email, firstName, lastName, fingerprint }: RegisterDTO,
    userAgent: string,
    authName: AuthProviderName,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const password = pass ? await this.scryptService.hash(pass) : undefined;
    const userID = uuid();
    const accessToken = this.jwtService.sign({ userID });
    const refreshToken = uuid();

    await this.usersService.registerUser({
      email,
      firstName,
      lastName,
      userID,
    });

    await this.refreshSessionsService.saveSession({
      refreshToken,
      userID,
      fingerprint,
      expiresIn: 5.184e9,
      createdAt: new Date(),
      userAgent,
    });

    await this.authProvidersService.saveProvider({ userID, authName, password });
    return { accessToken, refreshToken };
  }
}

import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ScryptService } from '../scrypt/scrypt.service';
import { v4 as uuid } from 'uuid';
import { UsersService } from '../users/users.service';
import RegisterDTO from './dto/register.dto';
import { RefreshSessionsService } from '../refresh-sessions/refresh-sessions.service';
import { AuthProvidersService } from '../auth-providers/auth-providers.service';
import { AuthProviderName } from '../auth-providers/dto/auth-provider.dto';
import AuthDTO from './dto/auth.dto';
import { RefreshSessionDTO } from '../refresh-sessions/dto/refresh-session.dto';
import { JwtService } from '@nestjs/jwt';
import AuthTokensPair from './dto/tokens-pair.dto';

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

    const { accessToken, refreshToken } = await this.createNewRefreshSession({
      userID,
      userAgent,
      fingerprint,
    });

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

  async login(
    { email, password, fingerprint }: AuthDTO,
    userAgent: string,
    authName: AuthProviderName,
  ): Promise<AuthTokensPair> {
    const { userID } = await this.usersService.findByEmail(email);
    const provider = await this.authProvidersService.findOne(userID, authName);
    const isValid =
      authName === 'local'
        ? await this.scryptService.verify(password as string, provider.password as string)
        : true;

    if (!isValid) throw new BadRequestException();

    return await this.createNewRefreshSession({
      userID,
      userAgent,
      fingerprint,
    });
  }

  async refreshTokens(
    refreshToken: string,
    fingerprint: string,
  ): Promise<AuthTokensPair> {
    const session = await this.refreshSessionsService.findOne(refreshToken);
    if (!session) throw new UnauthorizedException('INVALID_TOKEN');
    const {
      userID,
      fingerprint: oldFingerprint,
      createdAt,
      expiresIn,
      userAgent,
    } = session;
    await this.refreshSessionsService.delete(refreshToken);

    const expiredDate = new Date(createdAt.getTime() + +expiresIn);
    const now = new Date();
    if (expiredDate.getTime() <= now.getTime() || oldFingerprint !== fingerprint) {
      throw new UnauthorizedException('INVALID_REFRESH_SESSION');
    }

    return await this.createNewRefreshSession({
      userID,
      userAgent,
      fingerprint,
    });
  }

  async createNewRefreshSession({
    userID,
    fingerprint,
    userAgent,
  }: RefreshSessionDTO): Promise<AuthTokensPair> {
    const accessToken = this.jwtService.sign({ userID: userID });
    const refreshToken = uuid();
    await this.refreshSessionsService.saveSession({
      refreshToken,
      userID,
      fingerprint,
      expiresIn: 5.184e9,
      createdAt: new Date(),
      userAgent,
    });
    return { accessToken, refreshToken };
  }
}

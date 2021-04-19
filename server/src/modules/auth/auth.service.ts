import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ScryptService } from '../scrypt/scrypt.service';
import { v4 as uuid } from 'uuid';
import { UsersService } from '../users/users.service';
import { RefreshSessionsService } from '../refresh-sessions/refresh-sessions.service';
import { AuthProvidersService } from '../auth-providers/auth-providers.service';
import { AuthProviderName } from '../auth-providers/dto/auth-provider.dto';
import Session, { RefreshSessionDTO } from '../refresh-sessions/dto/refresh-session.dto';
import { JwtService } from '@nestjs/jwt';
import AuthTokensPair from './dto/tokens-pair.dto';
import GoogleResponse from './dto/google-response';
import { LoginParams, RegisterParams } from '@interfaces/routes/auth-routes';

@Injectable()
export class AuthService {
  private maxNumberOfSessions = 10;
  constructor(
    private scryptService: ScryptService,
    private jwtService: JwtService,
    private usersService: UsersService,
    private refreshSessionsService: RefreshSessionsService,
    private authProvidersService: AuthProvidersService,
  ) {}

  async register(
    { password: pass, email, firstName, lastName, astrologicalToken }: RegisterParams,
    authName: AuthProviderName,
    userAgent = '',
  ): Promise<{ accessToken: string; refreshToken: string }> {
      const oldUser = await this.usersService.findByEmail(email);
      if (oldUser) {
        throw new BadRequestException('User with such email exists already');
      }
    const password =
      authName === 'local' ? await this.scryptService.hash(pass as string) : undefined;
    const userID = uuid();

    await this.usersService.registerUser({
      email,
      firstName,
      lastName,
      userID,
    });

    const { accessToken, refreshToken } = await this.createNewRefreshSession({
      userID,
      userAgent,
      fingerprint: astrologicalToken,
    });

    await this.authProvidersService.saveProvider({ userID, authName, password });
    return { accessToken, refreshToken };
  }

  async login(
    { email, password, astrologicalToken: fingerprint }: LoginParams,
    userAgent: string,
    authName: AuthProviderName,
  ): Promise<AuthTokensPair> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException();
    }

    const { userID } = user;
    const provider = await this.authProvidersService.findOne(userID, authName);
    if (!provider) {
      throw new BadRequestException();
    }
    const isValid =
      authName === 'local'
        ? await this.scryptService.verify(password as string, provider.password as string)
        : true;

    if (!isValid) throw new BadRequestException();

    return await this.createNewRefreshSession({
      userID,
      userAgent,
      fingerprint: fingerprint,
    });
  }

  async checkSession(refreshToken: string, fingerprint: string): Promise<Session> {
    const session = await this.refreshSessionsService.findOne(refreshToken);
    if (!session) {
      throw new UnauthorizedException('INVALID_TOKEN');
    }

    const { fingerprint: oldFingerprint, createdAt, expiresIn } = session;
    await this.refreshSessionsService.delete(refreshToken);

    const expiredDate = new Date(createdAt.getTime() + +expiresIn);
    const now = new Date();
    if (expiredDate.getTime() <= now.getTime() || oldFingerprint !== fingerprint) {
      throw new UnauthorizedException('INVALID_REFRESH_SESSION');
    }

    return session;
  }

  async refreshTokens(
    refreshToken: string,
    fingerprint: string,
  ): Promise<AuthTokensPair> {
    const session = await this.checkSession(refreshToken, fingerprint);
    const { userID, userAgent } = session;

    return await this.createNewRefreshSession({
      userID,
      userAgent,
      fingerprint: fingerprint,
    });
  }

  async createNewRefreshSession({
    userID,
    fingerprint,
    userAgent,
  }: RefreshSessionDTO): Promise<AuthTokensPair> {
    const accessToken = this.jwtService.sign({ userID: userID });
    const refreshToken = uuid();

    const sessions = (await this.refreshSessionsService.find(userID)).sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    );

    const oldSameSession = sessions.find((s) => s.fingerprint === fingerprint);
    if (oldSameSession) {
      await this.refreshSessionsService.delete(oldSameSession.refreshToken);
    }

    if (sessions.length > this.maxNumberOfSessions - 1) {
      await this.refreshSessionsService.delete(sessions[0].refreshToken);
    }
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

  async googleAuth(
    userData: GoogleResponse,
    userAgent: string,
    astrologicalToken: string,
  ): Promise<AuthTokensPair> {
    const oldUser = await this.usersService.findByEmail(userData.email);
    if (!oldUser) {
      return await this.register(
        {
          email: userData.email,
          firstName: userData.given_name,
          lastName: userData.family_name,
          astrologicalToken,
        },
        'google',
        userAgent,
      );
    } else {
      const provider = await this.authProvidersService.findOne(oldUser.userID, 'google');
      if (!provider) {
        throw new BadRequestException();
      }

      return await this.login(
        {
          email: userData.email,
          astrologicalToken: astrologicalToken,
        },
        userAgent ? userAgent : '',
        'google',
      );
    }
  }
}

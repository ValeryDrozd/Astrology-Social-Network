import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import User, { UserUpdates, UserWithCompatibility } from '@interfaces/user';
import { RegisterData } from '../auth/dto/register.dto';
import { PgService } from '../pg/pg.service';
import UserEntity from './user.entity';
import { ZodiacSignsService } from '../zodiac-signs/zodiac-signs.service';
import { AuthProvidersService } from '../auth-providers/auth-providers.service';
import AuthTokensPair from '../auth/dto/tokens-pair.dto';
import { ScryptService } from '../scrypt/scrypt.service';
import { RefreshSessionsService } from '../refresh-sessions/refresh-sessions.service';
import { AuthService } from '../auth/auth.service';
import { SenderInfo } from '@interfaces/chat';

@Injectable()
export class UsersService {
  tableName = 'Users';
  constructor(
    private pgService: PgService,
    private zodiacSignsService: ZodiacSignsService,
    private authProvidersService: AuthProvidersService,
    private scryptService: ScryptService,
    private refreshSessionsService: RefreshSessionsService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async registerUser(registerData: RegisterData): Promise<void> {
    await this.pgService.create({ values: [registerData], tableName: this.tableName });
  }

  async getRecommendations(
    userID: string,
    sex?: boolean,
  ): Promise<UserWithCompatibility[]> {
    const user = await this.findById(userID);
    return await this.zodiacSignsService.getMyRecommendations(user, sex);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.pgService.findOne<UserEntity>({
      tableName: this.tableName,
      where: { email },
    });
    if (!user) {
      return user;
    }
    const { firstName, lastName, userID, birthDate, sex, zodiacSign, about } = user;
    const authProviders = (await this.authProvidersService.find(userID)).map(
      (a) => a.authName,
    );
    return {
      userID,
      firstName,
      lastName,
      email,
      birthDate,
      sex,
      zodiacSign,
      authProviders,
      about,
    };
  }

  async getSenderInfo(userID: string): Promise<SenderInfo> {
    const { firstName, lastName } = await this.pgService.findOne<{
      firstName: string;
      lastName: string;
    }>({
      query: ['firstName', 'lastName'],
      tableName: this.tableName,
      where: { userID },
    });

    return {
      senderID: userID,
      firstName,
      lastName,
    };
  }

  async findById(userID: string): Promise<User> {
    const user = await this.pgService.findOne<UserEntity>({
      tableName: this.tableName,
      where: { userID },
    });
    if (!user) {
      return user;
    }

    const { firstName, lastName, email, birthDate, sex, zodiacSign, about } = user;
    const authProviders = (await this.authProvidersService.find(userID)).map(
      (a) => a.authName,
    );
    return {
      userID,
      firstName,
      lastName,
      email,
      birthDate,
      sex,
      zodiacSign,
      authProviders,
      about,
    };
  }

  async patchUser(userID: string, updates: UserUpdates): Promise<void> {
    await this.pgService.update<Partial<UserEntity>>({
      tableName: this.tableName,
      updates: updates as Record<string, unknown>,
      where: { userID },
    });
  }

  async changePassword(
    userID: string,
    oldPassword: string,
    newPassword: string,
    fingerprint: string,
    userAgent: string,
  ): Promise<AuthTokensPair> {
    const user = await this.pgService.findOne<User>({
      tableName: this.tableName,
      where: { userID },
    });
    if (!user) throw new NotFoundException();

    const provider = await this.authProvidersService.findOne(user.userID, 'local');

    const isValid = await this.scryptService.verify(
      oldPassword,
      provider.password as string,
    );
    if (!isValid) {
      throw new BadRequestException();
    }

    await this.refreshSessionsService.deleteAll(userID);

    const newPass = await this.scryptService.hash(newPassword);
    await this.authProvidersService.changePassword(userID, newPass);

    return await this.authService.createNewRefreshSession({
      userID,
      fingerprint,
      userAgent,
    });
  }
}

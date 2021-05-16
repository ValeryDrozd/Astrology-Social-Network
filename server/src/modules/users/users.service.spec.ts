import User, { UserUpdates, UserWithCompatibility } from '@interfaces/user';
import { forwardRef } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthProvidersService } from '../auth-providers/auth-providers.service';
import AuthProviderDTO from '../auth-providers/dto/auth-provider.dto';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { RegisterData } from '../auth/dto/register.dto';
import AuthTokensPair from '../auth/dto/tokens-pair.dto';
import { PgService } from '../pg/pg.service';
import { RefreshSessionsService } from '../refresh-sessions/refresh-sessions.service';
import { ScryptService } from '../scrypt/scrypt.service';
import { ZodiacSignsService } from '../zodiac-signs/zodiac-signs.service';
import UserEntity from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('TestService', () => {
  let usersService: UsersService;
  let userModule: TestingModule;
  let pgService: PgService;
  let authProvidersService: AuthProvidersService;
  const email = 'email@gmail.com';
  const userID = 'userID';
  const password = 'password';
  const userEntity: UserEntity = {
    userID,
    firstName: 'firstName',
    lastName: 'lastName',
    email,
    password,
    birthDate: new Date(),
    sex: true,
    zodiacSign: 'Aries',
    about: 'about',
  };
  const authProviders: AuthProviderDTO[] = [
    {
      userID,
      authName: 'local',
      password,
    },
  ];

  beforeEach(async () => {
    userModule = await Test.createTestingModule({
      imports: [forwardRef(() => AuthModule)],
      controllers: [UsersController],
      providers: [UsersService],
      exports: [UsersService],
    }).compile();

    usersService = userModule.get(UsersService);
    pgService = userModule.get(PgService);
    authProvidersService = userModule.get(AuthProvidersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('should return the user by email', () => {
    it('if found', async () => {
      const pgFindOneSpy = jest
        .spyOn(pgService, 'findOne')
        .mockImplementation(() => Promise.resolve(userEntity));
      const authProvidersFindSpy = jest
        .spyOn(authProvidersService, 'find')
        .mockImplementation(() => Promise.resolve(authProviders));
      const user = await usersService.findByEmail(email);

      const expectedUser: Partial<UserEntity> & User = {
        ...userEntity,
        authProviders: authProviders.map((a) => a.authName),
      };
      delete expectedUser.password;

      expect(pgFindOneSpy).toHaveBeenCalledWith({
        tableName: usersService.tableName,
        where: { email },
      });
      expect(authProvidersFindSpy).toHaveBeenCalledWith(userEntity.userID);
      expect(user).toEqual(expectedUser);
    });

    it('if not found', async () => {
      const pgFindOneSpy = jest
        .spyOn(pgService, 'findOne')
        .mockImplementation(() => Promise.resolve(undefined));

      const user = await usersService.findByEmail(email);
      expect(pgFindOneSpy).toHaveBeenCalledWith({
        tableName: usersService.tableName,
        where: { email },
      });
      expect(user).toBeUndefined();
    });
  });

  describe('should return the user by userID', () => {
    it('if found', async () => {
      const pgFindOneSpy = jest
        .spyOn(pgService, 'findOne')
        .mockImplementation(() => Promise.resolve(userEntity));
      const authProvidersFindSpy = jest
        .spyOn(authProvidersService, 'find')
        .mockImplementation(() => Promise.resolve(authProviders));
      const user = await usersService.findById(userID);

      const expectedUser: Partial<UserEntity> & User = {
        ...userEntity,
        authProviders: authProviders.map((a) => a.authName),
      };
      delete expectedUser.password;

      expect(pgFindOneSpy).toHaveBeenCalledWith({
        tableName: usersService.tableName,
        where: { userID },
      });
      expect(authProvidersFindSpy).toHaveBeenCalledWith(userEntity.userID);
      expect(user).toEqual(expectedUser);
    });

    it('if not found', async () => {
      const pgFindOneSpy = jest
        .spyOn(pgService, 'findOne')
        .mockImplementation(() => Promise.resolve(undefined));

      const user = await usersService.findById(userID);

      expect(pgFindOneSpy).toHaveBeenCalledWith({
        tableName: usersService.tableName,
        where: { userID },
      });
      expect(user).toEqual(undefined);
    });
  });
  const defaultQueryResult = {
    rows: [],
    command: '',
    rowCount: 0,
    oid: 0,
    fields: [],
  };

  it('should patch the user', async () => {
    const pgUpdateSpy = jest
      .spyOn(pgService, 'update')
      .mockImplementation(() => Promise.resolve(defaultQueryResult));

    const { firstName, lastName, sex, birthDate, zodiacSign } = userEntity;
    const updates: UserUpdates = { firstName, lastName, sex, birthDate, zodiacSign };

    await usersService.patchUser(userID, updates);

    const expectedUser: Partial<UserEntity> & User = {
      ...userEntity,
      authProviders: authProviders.map((a) => a.authName),
    };
    delete expectedUser.password;

    expect(pgUpdateSpy).toHaveBeenCalledWith({
      tableName: usersService.tableName,
      updates: updates,
      where: { userID },
    });
  });

  it('should register user', async () => {
    const pgCreateSpy = jest
      .spyOn(pgService, 'create')
      .mockImplementation(() => Promise.resolve(defaultQueryResult));
    const { email, userID, firstName, lastName } = userEntity;
    const registerData: RegisterData = {
      email,
      userID,
      firstName,
      lastName,
    };

    const expectedProps = { values: [registerData], tableName: usersService.tableName };

    await usersService.registerUser(registerData);
    expect(pgCreateSpy).toHaveBeenCalledWith(expectedProps);
  });

  describe("should change user's password", () => {
    it('if old password is valid', async () => {
      const scryptService = userModule.get(ScryptService);
      const refreshSessionsService = userModule.get(RefreshSessionsService);
      const authService = userModule.get(AuthService);
      const oldPassword = 'old_password',
        newPassword = 'new_password',
        fingerprint = 'fingerprint',
        userAgent = 'userAgent';

      const authProvider = authProviders[0];
      const pgFindOneSpy = jest
        .spyOn(pgService, 'findOne')
        .mockImplementation(() => Promise.resolve(userEntity));

      const authProvidersFindOneSpy = jest
        .spyOn(authProvidersService, 'findOne')
        .mockImplementation(() => Promise.resolve(authProvider));

      const authChangePasswordSpy = jest
        .spyOn(authProvidersService, 'changePassword')
        .mockImplementation(() => Promise.resolve());

      const scryptVerifySpy = jest
        .spyOn(scryptService, 'verify')
        .mockImplementation(() => Promise.resolve(true));

      const hashedPassword = 'hashed_password';
      const scryptHashSpy = jest
        .spyOn(scryptService, 'hash')
        .mockImplementation(() => Promise.resolve(hashedPassword));

      const refrestDeleteAllSpy = jest
        .spyOn(refreshSessionsService, 'deleteAll')
        .mockImplementation(() => Promise.resolve());

      const tokensPair: AuthTokensPair = {
        accessToken: 'access_token',
        refreshToken: 'refrest_token',
      };

      const authCreateNewSessionSpy = jest
        .spyOn(authService, 'createNewRefreshSession')
        .mockImplementation(() => Promise.resolve(tokensPair));

      const newTokens = await usersService.changePassword(
        userID,
        oldPassword,
        newPassword,
        fingerprint,
        userAgent,
      );

      expect(pgFindOneSpy).toHaveBeenCalledWith({
        tableName: usersService.tableName,
        where: { userID },
      });

      expect(authProvidersFindOneSpy).toHaveBeenCalledWith(userEntity.userID, 'local');
      expect(scryptVerifySpy).toHaveBeenCalledWith(oldPassword, authProvider.password);
      expect(refrestDeleteAllSpy).toHaveBeenCalledWith(userID);
      expect(scryptHashSpy).toHaveBeenCalledWith(newPassword);
      expect(authChangePasswordSpy).toHaveBeenCalledWith(userID, hashedPassword);
      expect(authCreateNewSessionSpy).toHaveBeenCalledWith({
        userID,
        fingerprint,
        userAgent,
      });
      expect(newTokens).toEqual(tokensPair);
    });

    it('if old password is invalid', async () => {
      const scryptService = userModule.get(ScryptService);
      const oldPassword = 'wrond_old_password',
        newPassword = 'new_password',
        fingerprint = 'fingerprint',
        userAgent = 'userAgent';

      const authProvider = authProviders[0];
      const pgFindOneSpy = jest
        .spyOn(pgService, 'findOne')
        .mockImplementation(() => Promise.resolve(userEntity));

      const authProvidersFindOneSpy = jest
        .spyOn(authProvidersService, 'findOne')
        .mockImplementation(() => Promise.resolve(authProvider));

      const scryptVerifySpy = jest
        .spyOn(scryptService, 'verify')
        .mockImplementation(() => Promise.resolve(false));

      try {
        await usersService.changePassword(
          userID,
          oldPassword,
          newPassword,
          fingerprint,
          userAgent,
        );
        throw new Error('No error!');
      } catch {
        expect(pgFindOneSpy).toHaveBeenCalledWith({
          tableName: usersService.tableName,
          where: { userID },
        });
        expect(authProvidersFindOneSpy).toHaveBeenCalledWith(userEntity.userID, 'local');
        expect(scryptVerifySpy).toHaveBeenCalledWith(oldPassword, authProvider.password);
      }
    });

    it('if no user found', async () => {
      const oldPassword = 'wrond_old_password',
        newPassword = 'new_password',
        fingerprint = 'fingerprint',
        userAgent = 'userAgent';

      const pgFindOneSpy = jest
        .spyOn(pgService, 'findOne')
        .mockImplementation(() => Promise.resolve(undefined));

      try {
        await usersService.changePassword(
          userID,
          oldPassword,
          newPassword,
          fingerprint,
          userAgent,
        );
        throw new Error('No error!');
      } catch {
        expect(pgFindOneSpy).toHaveBeenCalledWith({
          tableName: usersService.tableName,
          where: { userID },
        });
      }
    });

    it('if local auth provider is not found', async () => {
      const oldPassword = 'wrond_old_password',
        newPassword = 'new_password',
        fingerprint = 'fingerprint',
        userAgent = 'userAgent';

      const authProvider = authProviders[0];
      const pgFindOneSpy = jest
        .spyOn(pgService, 'findOne')
        .mockImplementation(({ tableName }) =>
          tableName === usersService.tableName
            ? Promise.resolve(userEntity)
            : Promise.resolve(undefined),
        );

      const authProvidersFindOneSpy = jest
        .spyOn(authProvidersService, 'findOne')
        .mockImplementation(() => Promise.resolve(authProvider));

      try {
        await usersService.changePassword(
          userID,
          oldPassword,
          newPassword,
          fingerprint,
          userAgent,
        );
        throw new Error('No error!');
      } catch {
        expect(pgFindOneSpy).toHaveBeenCalledWith({
          tableName: usersService.tableName,
          where: { userID },
        });
        expect(authProvidersFindOneSpy).toHaveBeenCalledWith(userEntity.userID, 'local');
      }
    });
  });

  describe('should give recommendations', () => {
    let usersFindByIdSpy: jest.SpyInstance<Promise<User>>;
    let zodiacRecommendationsSpy: jest.SpyInstance<Promise<UserWithCompatibility[]>>;
    const foundUser: Partial<UserEntity> & User = {
      ...userEntity,
      authProviders: authProviders.map((a) => a.authName),
    };
    delete foundUser.password;

    beforeEach(() => {
      usersFindByIdSpy = jest
        .spyOn(usersService, 'findById')
        .mockImplementation(() => Promise.resolve(foundUser));
      const zodiacSignsService = userModule.get(ZodiacSignsService);
      zodiacRecommendationsSpy = jest
        .spyOn(zodiacSignsService, 'getMyRecommendations')
        .mockImplementation(() =>
          Promise.resolve([
            {
              ...foundUser,
              compatibility: 90,
            },
          ]),
        );
    });

    it('should give recommendations without sex', async () => {
      await usersService.getRecommendations(userID);
      expect(usersFindByIdSpy).toHaveBeenCalledWith(userID);
      expect(zodiacRecommendationsSpy).toHaveBeenCalledWith(foundUser, undefined);
    });
    it('should give recommendations without sex', async () => {
      const sex = true;
      await usersService.getRecommendations(userID, sex);
      expect(usersFindByIdSpy).toHaveBeenCalledWith(userID);
      expect(zodiacRecommendationsSpy).toHaveBeenCalledWith(foundUser, sex);
    });
  });
});

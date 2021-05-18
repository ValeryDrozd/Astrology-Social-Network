import { ChangeMyPasswordRouteProps } from '@interfaces/routes/user-routes';
import User, { UserUpdates } from '@interfaces/user';
import { forwardRef } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import AuthProviderDTO from '../auth-providers/dto/auth-provider.dto';
import { AuthModule } from '../auth/auth.module';
import UserEntity from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Request as ExpressRequest, Response } from 'express';
import AuthTokensPair from '../auth/dto/tokens-pair.dto';
import sendTokensPair from 'src/helpers/send-tokens-pair';

jest.mock('src/helpers/send-tokens-pair');

describe('UsersController', () => {
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
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    process.env.NODE_ENV = 'test';
    const userModule: TestingModule = await Test.createTestingModule({
      imports: [forwardRef(() => AuthModule)],
      controllers: [UsersController],
      providers: [UsersService],
      exports: [UsersService],
    }).compile();

    usersController = userModule.get<UsersController>(UsersController);
    usersService = userModule.get(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  it('should give my profile', async () => {
    const user = { userID };
    const foundUser: Partial<UserEntity> & User = {
      ...userEntity,
      authProviders: authProviders.map((a) => a.authName),
    };
    delete foundUser.password;
    const usersFindByIdSpy = jest
      .spyOn(usersService, 'findById')
      .mockImplementation(() => Promise.resolve(foundUser));
    await usersController.getMyProfile({ user });

    expect(usersFindByIdSpy).toHaveBeenCalledWith(userID);
  });

  it('should give recommendations', async () => {
    const user = { userID };
    const sex = true;
    const foundUser: Partial<UserEntity> & User = {
      ...userEntity,
      authProviders: authProviders.map((a) => a.authName),
    };
    delete foundUser.password;
    const usersRecsSpy = jest
      .spyOn(usersService, 'getRecommendations')
      .mockImplementation(() => Promise.resolve([{ ...foundUser, compatibility: 80 }]));

    await usersController.getRecommendations({ user }, { sex });
    expect(usersRecsSpy).toHaveBeenCalledWith(userID, sex);
  });

  it('should give user by id', async () => {
    const foundUser: Partial<UserEntity> & User = {
      ...userEntity,
      authProviders: authProviders.map((a) => a.authName),
    };
    delete foundUser.password;
    const usersFindByIdSpy = jest
      .spyOn(usersService, 'findById')
      .mockImplementation(() => Promise.resolve(foundUser));
    await usersController.getUserGyID(userID);

    expect(usersFindByIdSpy).toHaveBeenCalledWith(userID);
  });

  it("should patch user's profile", async () => {
    const user = { userID };
    const { firstName, lastName, sex, birthDate, zodiacSign } = userEntity;
    const updates: UserUpdates = { firstName, lastName, sex, birthDate, zodiacSign };

    const usersPatchUserSpy = jest
      .spyOn(usersService, 'patchUser')
      .mockImplementation(() => Promise.resolve());
    await usersController.patchUserProfile({ user }, updates);

    expect(usersPatchUserSpy).toHaveBeenCalledWith(userID, updates);
  });

  it("should changePassword user's password", async () => {
    const user = { userID };
    const body: ChangeMyPasswordRouteProps = {
      oldPassword: 'oldPassword',
      newPassword: 'newPassword',
      astrologicalToken: 'astrologicalToken',
    };
    const request: ExpressRequest = {
      headers: {
        'user-agent': 'user-agent',
      },
    } as ExpressRequest;
    const response: Response = {} as Response;
    const tokensPair: AuthTokensPair = {
      accessToken: 'access_token',
      refreshToken: 'refrest_token',
    };

    (sendTokensPair as jest.Mock).mockImplementationOnce(() => undefined);

    const usersChangePasswordSpy = jest
      .spyOn(usersService, 'changePassword')
      .mockImplementation(() => Promise.resolve(tokensPair));
    await usersController.changePassword({ user }, body, request, response);

    expect(usersChangePasswordSpy).toHaveBeenCalledWith(
      userID,
      body.oldPassword,
      body.newPassword,
      body.astrologicalToken,
      request.headers['user-agent'],
    );
    expect(sendTokensPair).toHaveBeenCalledWith(response, tokensPair);
  });
});

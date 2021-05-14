import getAstrologicalToken from 'helpers/get-astrological-token';
import Chat from 'interfaces/chat';
import { NewToken } from 'interfaces/new-token';
import { FullCreateNewChatRoute } from 'interfaces/routes/chat-routes';
import {
  FullChangeMyPasswordRoute,
  FullGetRecommendationsRoute,
  FullMyProfileRoute,
  FullPatchMyProfileRoute,
  FullUserByIDRoute,
} from 'interfaces/routes/user-routes';
import User, { UserWithCompability } from 'interfaces/user';
import {
  changeMyPassword,
  createNewChat,
  getHeaders,
  getMyProfile,
  getRecommendation,
  getUserProfile,
  patchMyProfile,
} from 'services/users.service';

jest.mock('helpers/get-astrological-token');

const mockFetch = (
  result?: unknown,
  ok = true,
): jest.Mock<Promise<Response>> => {
  const fetchMock = jest.fn(
    () =>
      Promise.resolve({
        ok,
        json: () => Promise.resolve(result),
      }) as Promise<Response>,
  );
  global.fetch = fetchMock;

  return fetchMock;
};

test('Should patch user`s profile', async () => {
  process.env.REACT_APP_SERVER_URL = 'some_url';
  const props = {
    accessToken: 'fffffffffffffffffffffffff',
    updates: { zodiacSign: 'Aries' },
  };

  const fetchMock = mockFetch();
  await patchMyProfile(props.accessToken, props.updates);

  const expectedURL = `${process.env.REACT_APP_SERVER_URL}${FullPatchMyProfileRoute}`;
  const expectedFetchConfig = {
    method: 'PATCH',
    body: JSON.stringify({ updates: props.updates }),
    headers: getHeaders(props.accessToken),
  };
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock).toHaveBeenCalledWith(expectedURL, expectedFetchConfig);
});

test('Should  throw error when ok is false', async () => {
  process.env.REACT_APP_SERVER_URL = 'some_url';

  const props = {
    accessToken: 'fffffffffffffffffffffffff',
    updates: { zodiacSign: 'Aries' },
  };

  const fetchMock = mockFetch(undefined, false);
  try {
    await patchMyProfile(props.accessToken, props.updates);
    expect(true).toBe(false);
  } catch {
    const expectedURL = `${process.env.REACT_APP_SERVER_URL}${FullPatchMyProfileRoute}`;
    const expectedFetchConfig = {
      method: 'PATCH',
      body: JSON.stringify({ updates: props.updates }),
      headers: getHeaders(props.accessToken),
    };
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(expectedURL, expectedFetchConfig);
  }
});

test('Should give my profile', async () => {
  process.env.REACT_APP_SERVER_URL = 'some_url';

  const testUser: User = {
    userID: '1233',
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email2@gmail.com',
    birthDate: new Date(),
    sex: true,
    zodiacSign: 'Aries',
  };
  const fetchMock = mockFetch(testUser);
  const accessToken = 'some_token';
  const profile = await getMyProfile(accessToken);

  const expectedURL = `${process.env.REACT_APP_SERVER_URL}${FullMyProfileRoute}`;
  const expectedFetchConfig = {
    method: 'GET',
    headers: getHeaders(accessToken),
  };
  expect(profile).toEqual(testUser);
  expect(fetchMock).toHaveBeenCalledWith(expectedURL, expectedFetchConfig);
});

test('shoud give recommendation', async () => {
  const testRecomendations: UserWithCompability[] = [
    {
      userID: '1234',
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email1@gmail.com',
      birthDate: new Date(),
      sex: true,
      zodiacSign: 'Aries',
      compability: 50,
    },
    {
      userID: '7890',
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email3@gmail.com',
      birthDate: new Date(),
      sex: true,
      zodiacSign: 'Taurus',
      compability: 30,
    },
  ];

  const fetchMock = mockFetch(testRecomendations);
  process.env.API_URL = 'some_url';
  const sex = true;
  const expectedPath = FullGetRecommendationsRoute + '?sex=' + sex;
  const accessToken = 'access_token';

  const users = await getRecommendation(accessToken, sex);

  const expectedFetchConfig = {
    method: 'GET',
    headers: getHeaders(accessToken),
  };
  expect(fetchMock).toHaveBeenCalledWith(
    process.env.API_URL + expectedPath,
    expectedFetchConfig,
  );

  expect(new Set(users)).toEqual(new Set(testRecomendations));
});

test('should throw error when ok is false', async () => {
  process.env.REACT_APP_SERVER_URL = 'some_url';

  const testUser: User = {
    userID: '1233',
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email4@gmail.com',
    birthDate: new Date(),
    sex: true,
    zodiacSign: 'Aries',
  };
  const fetchMock = mockFetch(testUser, false);
  const accessToken = 'some_token';
  try {
    await getMyProfile(accessToken);
    expect(true).toBe(false);
  } catch {
    const expectedURL = `${process.env.REACT_APP_SERVER_URL}${FullMyProfileRoute}`;
    const expectedFetchConfig = {
      method: 'GET',
      headers: getHeaders(accessToken),
    };
    expect(fetchMock).toHaveBeenCalledWith(expectedURL, expectedFetchConfig);
  }
});

test('Should create a new chat', async () => {
  process.env.REACT_APP_SERVER_URL = 'some_url';
  const testUserID = '1234';
  const accessToken = 'some_token';
  const testChat: Chat = {
    messageList: [],
    chatID: '1234',
    senderInfo: {
      firstName: 'firstName',
      lastName: 'lastName',
      senderID: 'senderID',
    },
  };
  const fetchMock = mockFetch(testChat);
  const chat = await createNewChat(accessToken, testUserID);

  const expectedConfig = {
    method: 'POST',
    headers: getHeaders(accessToken),
    body: JSON.stringify({ memberID: testUserID }),
  };
  expect(fetchMock).toHaveBeenCalledWith(
    process.env.REACT_APP_SERVER_URL + FullCreateNewChatRoute,
    expectedConfig,
  );

  expect(chat).toEqual(testChat);
});

test('Should throw error when ok is false', async () => {
  process.env.REACT_APP_SERVER_URL = 'some_url';
  const testUserID = '1234';
  const accessToken = 'some_token';
  const testChat: Chat = {
    messageList: [],
    chatID: '1234',
    senderInfo: {
      firstName: 'firstName',
      lastName: 'lastName',
      senderID: 'senderID',
    },
  };
  const fetchMock = mockFetch(testChat, false);
  try {
    await createNewChat(accessToken, testUserID);
    expect(true).toBe(false);
  } catch {
    const expectedConfig = {
      method: 'POST',
      headers: getHeaders(accessToken),
      body: JSON.stringify({ memberID: testUserID }),
    };
    expect(fetchMock).toHaveBeenCalledWith(
      process.env.REACT_APP_SERVER_URL + FullCreateNewChatRoute,
      expectedConfig,
    );
  }
});

test('Should give user profile', async () => {
  process.env.REACT_APP_SERVER_URL = 'some_url';
  const testUserID = '1234';
  const accessToken = 'some_token';
  const testUser: User = {
    userID: testUserID,
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email@gmail.com',
  };
  const fetchMock = mockFetch(testUser);

  const user = await getUserProfile(accessToken, testUserID);
  expect(user).toEqual(testUser);
  expect(fetchMock).toHaveBeenCalledWith(
    process.env.REACT_APP_SERVER_URL + FullUserByIDRoute + testUserID,
    {
      method: 'GET',
      headers: getHeaders(accessToken),
    },
  );
});

test('Should change password', async () => {
  process.env.REACT_APP_SERVER_URL = 'some_url';
  const accessToken = 'some_token';
  const testNewToken: NewToken = {
    accessToken: 'new_token',
  };
  const oldPassword = 'q12345';
  const newPassword = 'w12345';
  const fetchMock = mockFetch(testNewToken);

  const astrologicalToken = 'astrological_token';
  (getAstrologicalToken as jest.Mock).mockImplementationOnce(() =>
    Promise.resolve(astrologicalToken),
  );

  const newToken = await changeMyPassword(
    accessToken,
    oldPassword,
    newPassword,
  );

  expect(fetchMock).toHaveBeenCalledWith(
    process.env.REACT_APP_SERVER_URL + FullChangeMyPasswordRoute,
    {
      method: 'PATCH',
      body: JSON.stringify({ oldPassword, newPassword, astrologicalToken }),
      headers: getHeaders(accessToken),
    },
  );

  expect(getAstrologicalToken).toHaveBeenCalledTimes(1);
  expect(newToken).toEqual(testNewToken);
});

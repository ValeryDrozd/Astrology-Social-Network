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
import User, { UserUpdates, UserWithCompatibility } from 'interfaces/user';

export const getHeaders = (
  accessToken: string,
): { 'Content-Type': string; Authorization: string } => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${accessToken}`,
});

const get = async (path: string, accessToken: string): Promise<unknown> => {
  const res = await fetch(process.env.REACT_APP_SERVER_URL + path, {
    method: 'GET',
    headers: getHeaders(accessToken),
  });
  if (!res.ok) {
    throw new Error('Error');
  }
  const result = await res.json();
  result.birthDate = result?.birthDate
    ? new Date(result.birthDate)
    : new Date();
  return result;
};

const patch = async (
  path: string,
  body: Record<string, unknown>,
  accessToken: string,
  cookies = false,
): Promise<Response> => {
  const res = await fetch(process.env.REACT_APP_SERVER_URL + path, {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: getHeaders(accessToken),
    credentials: cookies ? 'include' : 'omit',
  });
  if (!res.ok) {
    throw new Error('Error');
  }

  return res;
};

const post = async (
  path: string,
  body: Record<string, unknown>,
  accessToken: string,
): Promise<Chat> => {
  const res = await fetch(process.env.REACT_APP_SERVER_URL + path, {
    method: 'POST',
    headers: getHeaders(accessToken),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error('Error');
  }
  return res.json();
};

export async function getRecommendation(
  accessToken: string,
  sex?: boolean,
): Promise<UserWithCompatibility[]> {
  const users = (await get(
    FullGetRecommendationsRoute + (sex !== undefined ? '?sex=' + sex : ''),
    accessToken,
  )) as UserWithCompatibility[];
  return users.map((user) => ({
    ...user,
    birthDate: user.birthDate ? new Date(user.birthDate) : new Date(),
  }));
}

export async function getUserProfile(
  accessToken: string,
  userID: string,
): Promise<User> {
  return (await get(FullUserByIDRoute + userID, accessToken)) as User;
}

export async function getMyProfile(accessToken: string): Promise<User> {
  return (await get(FullMyProfileRoute, accessToken)) as User;
}

export async function patchMyProfile(
  accessToken: string,
  updates: UserUpdates,
): Promise<void> {
  await patch(
    FullPatchMyProfileRoute,
    {
      updates: {
        ...updates,
        birthDate: updates.birthDate?.toDateString(),
      },
    },
    accessToken,
  );
}

export async function changeMyPassword(
  accessToken: string,
  oldPassword: string,
  newPassword: string,
): Promise<NewToken> {
  const astrologicalToken = await getAstrologicalToken();
  const res = await patch(
    FullChangeMyPasswordRoute,
    { oldPassword, newPassword, astrologicalToken },
    accessToken,
    true,
  );

  return (await res.json()) as NewToken;
}

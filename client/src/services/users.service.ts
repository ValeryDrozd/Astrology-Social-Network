import {
  FullMyProfileRoute,
  FullPatchMyProfileRoute,
  FullUserByIDRoute,
} from '../interfaces/routes/user-routes';
import User, { UserUpdates } from '../interfaces/user';

const get = async (path: string, accessToken: string): Promise<unknown> => {
  const res = await fetch(process.env.REACT_APP_SERVER_URL + path, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
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
  console.log(updates.birthDate?.toLocaleDateString());
  const res = await fetch(
    process.env.REACT_APP_SERVER_URL + FullPatchMyProfileRoute,
    {
      method: 'PATCH',
      body: JSON.stringify({
        updates: {
          ...updates,
          birthDate: updates.birthDate?.toLocaleDateString(),
        },
      }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );
  if (!res.ok) {
    throw new Error('Error');
  }
}

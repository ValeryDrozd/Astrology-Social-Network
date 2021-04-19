import { FullMyProfileRoute } from '../interfaces/routes/user-routes';
import User from '../interfaces/user';

export async function getMyProfile(accessToken: string): Promise<User> {
  const res = await fetch(
    process.env.REACT_APP_SERVER_URL + FullMyProfileRoute,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  if (!res.ok) {
    throw new Error('Error');
  }
  const result = await res.json();
  result.birthDate = result?.birthDate
    ? new Date(result.birthDate)
    : new Date();
  return result;
}

// export async function UserByIDRoute()

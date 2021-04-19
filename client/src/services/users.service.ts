import { FullMyProfileRoute } from '../interfaces/routes/user-routes';
import User from '../interfaces/user';

export async function getMyProfile(accessToken: string): Promise<User> {
  const params = new URLSearchParams();
  params.append('accessToken', accessToken);
  const res = await fetch(
    process.env.REACT_APP_SERVER_URL +
      FullMyProfileRoute +
      '?' +
      params.toString(),
  );
  if (!res.ok) {
    throw new Error('Error');
  }
  return await res.json();
}

// export async function UserByIDRoute()

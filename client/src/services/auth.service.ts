import getFingerprint from '../helpers/get-fingerprint';
import { NewToken } from '../interfaces/new-token';

const post = async (
  path: string,
  body: Record<string, unknown>,
): Promise<unknown> => {
  const res = await fetch(process.env.REACT_APP_SERVER_URL + path, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    credentials: 'include',
  });
  return await res.json();
};

export async function login(
  email: string,
  password: string,
): Promise<NewToken> {
  const fingerprint = await getFingerprint();
  return (await post('/auth/login', {
    email,
    password,
    fingerprint,
  })) as NewToken;
}

export async function register(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): Promise<NewToken> {
  const fingerprint = await getFingerprint();
  return (await post('/auth/register', {
    firstName,
    lastName,
    email,
    password,
    fingerprint,
  })) as NewToken;
}

export async function refresh(): Promise<NewToken> {
  const fingerprint = await getFingerprint();
  return (await post('/auth/refresh-tokens', { fingerprint })) as NewToken;
}

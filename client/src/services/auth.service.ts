import { GoogleLoginResponse } from 'react-google-login';
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
  if (!res.ok) {
    throw new Error('Invalid request');
  }
  return await res.json();
};

export async function login(
  email: string,
  password: string,
): Promise<NewToken> {
  const astrologicalToken = await getFingerprint();
  return (await post('/auth/login', {
    email,
    password,
    astrologicalToken,
  })) as NewToken;
}

export async function register(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): Promise<NewToken> {
  const astrologicalToken = await getFingerprint();
  return (await post('/auth/register', {
    firstName,
    lastName,
    email,
    password,
    astrologicalToken,
  })) as NewToken;
}

export async function refresh(): Promise<NewToken> {
  const astrologicalToken = await getFingerprint();
  return (await post('/auth/refresh-tokens', {
    astrologicalToken,
  })) as NewToken;
}

export async function responseGoogle(
  res: GoogleLoginResponse,
): Promise<NewToken> {
  return (await post('/auth/google', {
    tokenId: res.tokenId,
    astrologicalToken: await getFingerprint(),
  })) as NewToken;
}

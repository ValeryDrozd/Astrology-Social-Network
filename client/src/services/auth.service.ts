import axios from 'axios';
import getFingerprint from '../helpers/get-fingerprint';
import { NewToken } from '../interfaces/new-token';

export async function login(
  email: string,
  password: string,
): Promise<NewToken> {
  const fingerprint = await getFingerprint();
  const res = await axios.post(
    'http://localhost:3001/auth/login',
    {
      email,
      password,
      fingerprint,
    },
    {
      withCredentials: true,
    },
  );

  console.log(res.data);
  return res.data;
}

export async function register(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): Promise<NewToken> {
  const fingerprint = await getFingerprint();
  const res = await axios.post(
    'http://localhost:3001/auth/register',
    {
      firstName,
      lastName,
      email,
      password,
      fingerprint,
    },
    {
      withCredentials: true,
    },
  );

  return res.data;
}

export async function refresh(): Promise<NewToken> {
  const fingerprint = await getFingerprint();
  const res = await axios.post(
    'http://localhost:3001/auth/refresh-tokens',
    {
      fingerprint,
    },
    {
      withCredentials: true,
    },
  );

  return res.data;
}

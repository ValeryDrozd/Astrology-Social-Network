import { Response } from 'express';
import AuthTokensPair from 'src/modules/auth/dto/tokens-pair.dto';
import { NewToken } from '@interfaces/new-token';

export default function sendTokensPair(
  res: Response,
  { refreshToken, accessToken }: AuthTokensPair,
): void {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 5.184e9,
    path: '/auth',
  });
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    maxAge: 30 * 60000,
    path: '/chattings',
  });
  const newToken: NewToken = { accessToken };
  res.send(newToken);
}

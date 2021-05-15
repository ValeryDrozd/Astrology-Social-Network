import jwt from 'jsonwebtoken';

export default function checkToken(
  accessToken: string,
): { userID: string; exp: number; iat: number } | undefined {
  try {
    return jwt.verify(
      accessToken,
      process.env.REACT_APP_JWT_SECRET as string,
    ) as { userID: string; exp: number; iat: number };
  } catch (error) {}
}

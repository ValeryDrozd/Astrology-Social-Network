export default interface RefreshSessionDTO {
  userID: string;
  refreshToken: string;
  userAgent: string;
  fingerprint: string;
  expiresIn: number;
  createdAt: Date;
}

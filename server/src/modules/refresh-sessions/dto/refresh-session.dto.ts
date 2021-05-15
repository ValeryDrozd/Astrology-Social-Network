export interface RefreshSessionDTO {
  userID: string;
  fingerprint: string;
  userAgent: string;
}

export default interface Session extends RefreshSessionDTO {
  refreshToken: string;
  expiresIn: number;
  createdAt: Date;
}

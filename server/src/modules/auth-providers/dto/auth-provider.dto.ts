export type AuthProviderName = 'local' | 'google';

export default interface AuthProviderDTO {
  userID: string;
  authName: AuthProviderName;
  password?: string;
}

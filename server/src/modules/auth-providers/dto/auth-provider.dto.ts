import { AuthProviderName } from '@interfaces/user';

export default interface AuthProviderDTO {
  userID: string;
  authName: AuthProviderName;
  password?: string;
}

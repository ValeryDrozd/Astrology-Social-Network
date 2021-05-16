import { Type } from 'class-transformer';
export type AuthProviderName = 'local' | 'google';

export default interface User {
  userID: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate?: Date;
  about?: string;
  sex?: boolean;
  zodiacSign?: string;
  authProviders: AuthProviderName[];
}

export interface UserWithCompatibility extends User {
  compatibility: number;
}

export class UserUpdates {
  firstName?: string;
  lastName?: string;
  @Type(() => Date.UTC)
  birthDate?: Date;
  about?: string;
  sex?: boolean;
  zodiacSign?: string;
}

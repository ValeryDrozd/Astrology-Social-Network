import { IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export default interface User {
  userID: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate?: Date;
  sex?: boolean;
  zodiacSign?: string;
}

export class UserUpdates {
  firstName?: string;
  lastName?: string;
  @Type(() => Date.UTC)
  birthDate?: Date;
  sex?: boolean;
  zodiacSign?: string;
}

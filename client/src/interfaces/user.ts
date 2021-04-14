export default interface User {
  userID: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date;
  sex: boolean;
}

export interface UserUpdates {
  firstName?: string;
  lastName?: string;
  birthDate?: Date;
  sex?: boolean;
}

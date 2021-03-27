export default interface RegisterDTO {
  email: string;
  password?: string;
  fingerprint: string;
  firstName: string;
  lastName: string;
}

export interface RegisterData {
  email: string;
  userID: string;
  firstName: string;
  lastName: string;
}

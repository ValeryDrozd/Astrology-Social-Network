import { IsString } from 'class-validator';
import AuthDTO from './auth.dto';

export default class RegisterDTO extends AuthDTO {
  @IsString()
  firstName!: string;
  @IsString()
  lastName!: string;
}

export interface RegisterData {
  email: string;
  userID: string;
  firstName: string;
  lastName: string;
}

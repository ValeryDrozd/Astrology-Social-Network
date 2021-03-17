import { Injectable } from '@nestjs/common';
import GoogleUserDTO from './dto/google-user.dto';

@Injectable()
export class GoogleService {
  googleLogin({
    user,
  }: {
    user: GoogleUserDTO;
  }): { message: string; user: GoogleUserDTO } {
    if (!user) {
      return {
        message: 'No user from google',
        user,
      };
    }

    return {
      message: 'User information from google',
      user,
    };
  }
}

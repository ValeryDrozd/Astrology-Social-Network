import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

import { Injectable } from '@nestjs/common';
import GoogleUserDTO from './dto/google-user.dto';
import GoogleProfile from './dto/google-profile.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: 'http://localhost:3001/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
    done: VerifyCallback,
  ): Promise<void> {
    const { name, emails, photos } = profile;
    const user: GoogleUserDTO = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}

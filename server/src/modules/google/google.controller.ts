import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import GoogleUserDTO from './dto/google-user.dto';
import { GoogleService } from './google.service';

@Controller('google')
export class GoogleController {
  constructor(private googleService: GoogleService) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(): Promise<void> {}

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(
    @Req() req: { user: GoogleUserDTO },
  ): { message: string; user: GoogleUserDTO } {
    return this.googleService.googleLogin(req);
  }
}

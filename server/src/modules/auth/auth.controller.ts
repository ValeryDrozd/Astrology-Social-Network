import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Res,
  Req,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import sendTokensPair from 'src/helpers/send-tokens-pair';
import { AuthService } from './auth.service';
import AuthDTO from './dto/auth.dto';
import RegisterDTO from './dto/register.dto';
import GoogleResponse from './dto/google-response';
import fetch from 'node-fetch';

const userAgentName = 'user-agent';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(
    @Body() registerDTO: RegisterDTO,
    @Res({ passthrough: true }) response: Response,
    @Req() { headers }: Request,
  ): Promise<void> {
    const userAgent = String(headers[userAgentName]);
    const pair = await this.authService.register(registerDTO, userAgent, 'local');

    sendTokensPair(response, pair);
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(
    @Body() authDTO: AuthDTO,
    @Res({ passthrough: true }) response: Response,
    @Req() { headers }: Request,
  ): Promise<void> {
    const userAgent = String(headers[userAgentName]);
    const pair = await this.authService.login(authDTO, userAgent, 'local');
    sendTokensPair(response, pair);
  }

  @Post('refresh-tokens')
  async refreshTokens(
    @Body('fingerprint') fingerprint: string,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const { refreshToken: oldToken } = request.cookies;
    if (!oldToken) throw new UnauthorizedException('No refresh token');
    const pair = await this.authService.refreshTokens(oldToken, fingerprint);
    sendTokensPair(response, pair);
  }

  @Post('google')
  async googleAuth(
    @Body() body: { accessToken: string; tokenId: string; fingerprint: string },
    @Req() { headers }: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const userData = (await fetch(
      process.env.GOOGLE_RESOURCE_ID + body.tokenId,
    ).then((res) => res.json())) as GoogleResponse;

    if (!userData.email_verified) {
      throw new BadRequestException('Not confirmed google account!');
    }
    const userAgent = String(headers[userAgentName]);

    const pair = await this.authService.googleAuth(userData, userAgent, body.fingerprint);
    sendTokensPair(response, pair);
  }
}

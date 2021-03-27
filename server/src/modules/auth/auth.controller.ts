import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import AuthDTO from './dto/auth.dto';
import RegisterDTO from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(
    @Body() registerDTO: RegisterDTO,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ): Promise<void> {
    const userAgent = request.headers['user-agent'];
    const { refreshToken, accessToken } = await this.authService.register(
      registerDTO,
      userAgent ? userAgent : '',
      'local',
    );

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 5.184e9,
      path: '/auth',
    });
    response.send({ accessToken });
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(
    @Body() authDTO: AuthDTO,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ): Promise<void> {
    const userAgent = request.headers['user-agent'];
    const { refreshToken, accessToken } = await this.authService.login(
      authDTO,
      userAgent ? userAgent : '',
      'local',
    );

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 5.184e9,
      path: '/auth',
    });
    response.send({ accessToken });
  }

  @Post('refresh-tokens')
  async refreshTokens(
    @Body('fingerprint') fingerprint: string,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const { refreshToken: oldToken } = request.cookies;
    if (!oldToken) throw new UnauthorizedException('No refresh token');
    const { refreshToken, accessToken } = await this.authService.refreshTokens(
      oldToken,
      fingerprint,
    );
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 5.184e9,
      path: '/auth',
    });
    response.send({ accessToken });
  }
}

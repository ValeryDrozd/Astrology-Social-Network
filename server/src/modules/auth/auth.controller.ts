import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Res,
  Req,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import RegisterDTO from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  // @UsePipes(new ValidationPipe({ transform: true }))
  async register(
    @Body() registerDTO: RegisterDTO,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ): Promise<void> {
    const { refreshToken, accessToken } = await this.authService.register(
      registerDTO,
      request.headers['user-agent'] ? request.headers['user-agent'] : '',
      'local',
    );

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 5.184e9,
    });
    response.send({ accessToken });
  }
}

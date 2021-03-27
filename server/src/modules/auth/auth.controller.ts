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
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(
    @Body() registerDTO: RegisterDTO,
    @Res() response: Response,
    @Req() request: Request,
  ): Promise<void> {
    const { refreshToken, accessToken } = await this.authService.register(
      registerDTO,
      request.headers['user-agent'] ? request.headers['user-agent'] : '',
      'local',
    );

    response
      .set({
        'Set-Cookie': `refreshToken='${refreshToken}'; HttpOnly; Max-Age=`,
      })
      .send({ accessToken });
  }
}

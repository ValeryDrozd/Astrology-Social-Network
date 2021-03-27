import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import AuthDTO from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  login(@Body() authDTO: AuthDTO): void {}
}

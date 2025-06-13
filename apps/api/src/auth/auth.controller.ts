import {
  Body,
  Controller,
  Post, Res
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { loginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async signIn(@Body() signInDto: loginDto, @Res({ passthrough: true }) res:Response) {
    const tokens = await this.authService.signIn(signInDto.email, signInDto.password);
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });

    return { access_token: tokens.access_token };
  }

  @Public()
  @Post('register')
  register(@Body() signInDto: RegisterDto) {
    return this.authService.createUser(signInDto.email, signInDto.password, signInDto.name);
  }
}

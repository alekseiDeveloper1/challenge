import {
  Body,
  Controller,
  Post, Req, Res, UnauthorizedException
} from '@nestjs/common';
import { Response, Request } from 'express';
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
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 1000,
    });
    return { access_token: true };
  }

  @Public()
  @Post('register')
  register(@Body() signInDto: RegisterDto) {
    return this.authService.createUser(signInDto.email, signInDto.password, signInDto.name);
  }

  @Public()
  @Post('refresh')
  async refresh( @Req() req: Request, @Res({ passthrough: true }) res:Response) {
    if (!req.cookies) {
      throw new UnauthorizedException('Token not found');
    }
    const refreshToken = req.cookies['refresh_token'];

    const tokens = await this.authService.refreshTokens(refreshToken);
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: true,
    });
    return { accessToken: tokens.access_token };
  }
}

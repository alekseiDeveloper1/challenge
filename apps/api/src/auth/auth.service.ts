import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { PasswordService } from './password.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache} from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private passwordService: PasswordService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}
  private readonly SALT_ROUNDS = 12;

  async createUser(email: string, password: string, name: string): Promise<User> {
    await this.cacheManager.del('all_users');
    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS) || '';
    return this.prisma.user.create({
      data: { email, password: hashedPassword, name },
    });
  }

  async signIn(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!await this.passwordService.comparePasswords(pass, user?.password)) {
      throw new UnauthorizedException();
    }
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '15m',
        secret: process.env.JWT_ACCESS_SECRET,
      }),
      refresh_token: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_SECRET,
      }),
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.usersService.findByEmail(payload.email);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newPayload = { sub: user.id, email: user.email };

      const newAccessToken = await this.jwtService.signAsync(newPayload, {
        expiresIn: '15m',
        secret: process.env.JWT_ACCESS_SECRET,
      });

      const newRefreshToken = await this.jwtService.signAsync(newPayload, {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_SECRET,
      });

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}

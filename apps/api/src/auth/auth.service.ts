import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { PasswordService } from './password.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache} from 'cache-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private passwordService: PasswordService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  private configService: ConfigService
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
    const user = await this.findByEmailWithPassword(email);
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!await this.passwordService.comparePasswords(pass, user?.password)) {
      throw new UnauthorizedException();
    }
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '15m',
        secret: secret,
      }),
      refresh_token: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: secret,
      }),
    };
  }

  public async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      const user = await this.findByEmail(payload.email);
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

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
    };
  }
  private async findByEmailWithPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      password: user.password
    };
  }
}

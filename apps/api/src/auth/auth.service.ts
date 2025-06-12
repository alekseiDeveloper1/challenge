import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private passwordService: PasswordService
  ) {}
  private readonly SALT_ROUNDS = 12;

  async createUser(email: string, password: string, name: string): Promise<User> {
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
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}

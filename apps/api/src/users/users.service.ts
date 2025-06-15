import { Injectable, Request } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';

export type User = {
  id: number;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService
  ) {}
  @CacheKey('all_users')
  @CacheTTL(30)
  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(@Request() req:any) {
    return {
      id: req.user.userId,
      email: req.user.email,
      roles: req.user.roles
    };
  }
}

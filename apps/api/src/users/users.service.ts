import { Injectable, Request } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

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
  constructor(private prisma: PrismaService) {}

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

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}

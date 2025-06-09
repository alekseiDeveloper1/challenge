import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

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

  private readonly SALT_ROUNDS = 12;

  async createUser(email: string, password: string, name: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS) || '';
    return this.prisma.user.create({
      data: { email, password: hashedPassword, name },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}

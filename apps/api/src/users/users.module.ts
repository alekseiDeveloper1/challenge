import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [UsersService, PrismaService],
})
export class UsersModule {}

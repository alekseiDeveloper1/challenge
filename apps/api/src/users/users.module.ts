import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UserController } from './user.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register({})],
  controllers: [UserController],
  providers: [UsersService, PrismaService],
  exports: [UsersService]
})
export class UsersModule {}

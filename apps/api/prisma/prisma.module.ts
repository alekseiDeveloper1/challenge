// src/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Делает модуль глобально доступным
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Важно: экспортируем сервис
})
export class PrismaModule {}
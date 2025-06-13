import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      ttl: 30 * 1000,
      max: 100,
    }),
  ],
  exports: [CacheModule],
})
export class CustomCacheModule {}
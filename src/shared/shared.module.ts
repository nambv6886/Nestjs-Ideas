import { Module } from '@nestjs/common';
import { CacheService } from './cache/cache.service';

const services = [
  CacheService
]

@Module({
  providers: [
    ...services,
  ],
  exports: [
    ...services
  ]
})
export class SharedModule { }

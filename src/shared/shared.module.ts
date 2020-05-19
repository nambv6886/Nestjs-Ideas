import { Module } from '@nestjs/common';
import { CacheService } from './cache/cache.service';
import { SocketGateway } from './socket.gateway';

const services = [
  CacheService,
  SocketGateway
]

@Module({
  providers: [
    ...services
  ],
  exports: [
    ...services
  ]
})
export class SharedModule { }

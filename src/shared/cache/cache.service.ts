import { Injectable } from '@nestjs/common';
import * as cache from 'memory-cache';
import { CommonUtils } from '../../common/utils/common.util';

// const memoryCache = cache.caching({
//   store: 'memory',
//   max: 1000,
//   ttl: 3600
// })

@Injectable()
export class CacheService {
  public set(key: string, value: any, durationInSecond: number, timeoutCallback?: (...args: any[]) => void) {
    if (CommonUtils.isNullorUndefined(key) || CommonUtils.isNullorUndefined(value)) {
      throw Error('Cache key and value is required');
    }

    cache.put(key, value, durationInSecond, timeoutCallback);
  }

  public get<T>(key: string): T {
    if (CommonUtils.isNullorUndefined(key)) {
      throw Error('Cache key is required');
    }

    return cache.get(key) as T;
  }
}

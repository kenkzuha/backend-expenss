import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client = new Redis(process.env.REDIS_URL!);

  async set(key: string, value: string, ttlSeconds: number){
    await this.client.set(key, value, 'EX', ttlSeconds);
  }

  async get(key: string): Promise<String | null> {
    return this.client.get(key);
  }

  async del(key: string){
    await this.client.del(key);
  }

  onModuleDestroy() {
    this.client.disconnect();
  }
}

import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { ApiModule } from './api/api.module';
import { ConfigModule } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    CacheModule.register({
       isGlobal: true,
      //  store: redisStore,
       url: process.env.REDIS_HOST,
      //  port:  process.env.REDIS_PORT,
      //  username: process.env.REDIS_USERNAME,
      //  password: process.env.REDIS_PASSWORD,
       no_ready_check: true,
      }),
    ApiModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

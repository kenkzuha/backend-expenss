import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './datasource';
import { AuthModule } from './auth/auth.module';
import { RedisService } from './redis/redis.service';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [UsersModule, TypeOrmModule.forRoot(AppDataSource.options), AuthModule],
  controllers: [AppController],
  providers: [AppService, RedisService, EmailService],
})
export class AppModule {}

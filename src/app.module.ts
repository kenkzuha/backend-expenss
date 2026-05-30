import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './datasource';
import { AuthModule } from './auth/auth.module';
import { RedisService } from './redis/redis.service';
import { EmailService } from './email/email.service';
import { ExpensesModule } from './expenses/expenses.module';
import { BudgetsModule } from './budgets/budgets.module';

@Module({
  imports: [UsersModule, TypeOrmModule.forRoot(AppDataSource.options), AuthModule, ExpensesModule, BudgetsModule],
  controllers: [AppController],
  providers: [AppService, RedisService, EmailService],
})
export class AppModule {}

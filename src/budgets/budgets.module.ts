import { Module } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { BudgetsController } from './budgets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetsEntity } from './budgets.entity';

@Module({
  providers: [BudgetsService],
  controllers: [BudgetsController],
  imports: [TypeOrmModule.forFeature([BudgetsEntity])],
  exports: [BudgetsService]
})
export class BudgetsModule {}

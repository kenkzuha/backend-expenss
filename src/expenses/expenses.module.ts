import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesEntity } from './expenses.entity';

@Module({
  exports: [ExpensesService],
  controllers: [ExpensesController],
  providers: [ExpensesService],
  imports: [TypeOrmModule.forFeature([ExpensesEntity])]
})
export class ExpensesModule {}

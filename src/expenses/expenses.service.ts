import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExpensesEntity } from './expenses.entity';
import { Repository } from 'typeorm';
import { ExpensesDto } from './expenses.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(ExpensesEntity) private readonly expensesRepo: Repository<ExpensesEntity>,
  ){}

  async getExpenses(userId: number, month: number, year: number){
    return this.expensesRepo.createQueryBuilder('e')
    .where('e.userId = :userId', { userId })
    .andWhere('EXTRACT(MONTH FROM e.date) = :month', { month })
    .andWhere('EXTRACT(YEAR FROM e.date) = :year', { year })
    .orderBy('e.date', 'DESC')
    .getMany();
  }

  async createExpense(userId: number, data: ExpensesDto){
    const expense = this.expensesRepo.create({ ...data, userId });
    return this.expensesRepo.save(expense);
  }

  async deleteExpense(userId: number, id: number){
    const expense = await this.expensesRepo.findOne({ where: { userId, id } });

    if(!expense) throw new NotFoundException('Expense not found');

    return this.expensesRepo.delete({ id, userId });
  }
}
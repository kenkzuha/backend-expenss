import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BudgetsEntity } from './budgets.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BudgetsService {

  constructor(
    @InjectRepository(BudgetsEntity) private readonly budgetsRepository: Repository<BudgetsEntity>,
  ){}

  async getBudget(userId: number, month: number, year: number){
    return await this.budgetsRepository.findOne({ where: { userId, month, year }, select: { amount: true } });
  }

  async setBudget(userId: number, month: number, year: number, amount: number){
    const existing = await this.budgetsRepository.findOne({
      where: { userId, month, year }
    });
    
    if(existing) {
      existing.amount = amount;
      return this.budgetsRepository.save(existing);
    }

    const budgetData = this.budgetsRepository.create({ userId, month, year, amount });
    return await this.budgetsRepository.save(budgetData);
  }
}

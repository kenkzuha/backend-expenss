import { Controller, Get, Put, Query, Req, Body, UseGuards } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('budgets')
export class BudgetsController {

  constructor(private readonly budgetService: BudgetsService){}

  @UseGuards(AuthGuard)
  @Get()
  getBudget(@Req() req: Request,@Query('month') month: string, @Query('year') year: string){
    const userId = req['user'].sub;
    return this.budgetService.getBudget(userId, Number(month), Number(year));
  }

  @UseGuards(AuthGuard)
  @Put()
  setBudget(@Req() req: Request, @Body() data: { month: number, year: number, amount: number}){
    const userId = req['user'].sub;
    return this.budgetService.setBudget(userId, data.month, data.year, data.amount);
  }
}

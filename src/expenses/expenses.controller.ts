import { Controller, Get, Post, Query, Body, Delete, Param, Req, UseGuards } from '@nestjs/common';
import { ExpensesDto } from './expenses.dto';
import { ExpensesService } from './expenses.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('expenses')
export class ExpensesController {

  constructor(private readonly expensesService: ExpensesService) {}

  @UseGuards(AuthGuard)
  @Get()
  getExpense(@Req() req: any, @Query('month') month: string, @Query('year') year: string) {
    const userId: number = req['user'].sub;
    return this.expensesService.getExpenses(userId, Number(month), Number(year));
  }

  @UseGuards(AuthGuard)
  @Post()
  createExpense(@Req() req: any, @Body() expenses: ExpensesDto) {
    const userId: number = req['user'].sub;
    return this.expensesService.createExpense(userId, expenses);
  }
  
  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteExpense(@Req() req: any, @Param('id') id: string) {
    const userId: number = req['user'].sub;
    return this.expensesService.deleteExpense(userId, Number(id));
  }
}

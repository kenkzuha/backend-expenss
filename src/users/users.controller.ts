import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersDto } from './users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService){}

  @Get()
  getAllUsers(){
    return this.usersService.getAllUsers();
  }


}

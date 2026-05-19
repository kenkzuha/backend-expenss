import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';
import { UsersDto } from './users.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UsersEntity) private usersRepository: Repository<UsersEntity>){}

  getAllUsers(){
    return this.usersRepository.find();
  }

  async saveUsers(usersData: UsersDto){
    const existingUser = await this.usersRepository.findOne({
      where: [
        { username: usersData.username },
        { email: usersData.email },
      ],
    });

    if(existingUser){
      const message = existingUser.email === usersData.email ? 'Email already taken' : 'Username already taken';
      throw new ConflictException(message);
    }
      
    try {
      const hashedPassword = await bcrypt.hash(usersData.password, 10);
      const newData = this.usersRepository.create({...usersData, password: hashedPassword});
      const savedUser = await this.usersRepository.save(newData);
      const { password, ...withoutPassword } = savedUser;
      return {
        savedUserSuccess: "Account created successfully! Please log in",
      };

    } catch (error) {
      throw new InternalServerErrorException('Register Failed, Internal Server Error');
    }
  }

  async findUser(username: string){
    return await this.usersRepository.findOne({ where: {username} });
  }

}

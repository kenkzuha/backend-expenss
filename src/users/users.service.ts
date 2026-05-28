import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UsersEntity) private usersRepository: Repository<UsersEntity>){}

  getAllUsers(){
    return this.usersRepository.find();
  }

  async createVerifiedUser(data: { username: string; email: string; hashedPassword: string }) {
    try {
      const user = this.usersRepository.create({
        username: data.username,
        email: data.email,
        password: data.hashedPassword,
        isEmailVerified: true,
      });
      await this.usersRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findUser(username: string){
    return await this.usersRepository.findOne({ where: { username } });
  }

  async findUserByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email } });
  }
}

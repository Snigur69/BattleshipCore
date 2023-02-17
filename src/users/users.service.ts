import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../typeorm/entities/User';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  create(createUserDto: CreateUserDto) {
    const id = uuidv4();
    const newUser = this.userRepository.create({ ...createUserDto, id });

    return this.userRepository.save(newUser);
  }

  findOne(id: string) {
    return this.userRepository.findOneById(id);
  }
}

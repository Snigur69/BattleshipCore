import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { UserErrors } from '../enums/errors';
import { User } from '../typeorm/entities/User';

import { CreateUserDto } from './dto/create-user.dto';

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

  async findOne(id: string) {
    const user = await this.userRepository.findOneById(id);

    if (!user) {
      throw new Error(UserErrors.NotExist);
    }

    return user;
  }
}

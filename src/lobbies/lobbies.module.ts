import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Lobby } from '../typeorm/entities/Lobby';
import { User } from '../typeorm/entities/User';

import { LobbiesController } from './lobbies.controller';
import { LobbiesService } from './lobbies.service';

@Module({
  imports: [TypeOrmModule.forFeature([Lobby, User])],
  controllers: [LobbiesController],
  providers: [LobbiesService],
})
export class LobbiesModule {}

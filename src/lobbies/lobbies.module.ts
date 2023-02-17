import { Module } from '@nestjs/common';
import { LobbiesService } from './lobbies.service';
import { LobbiesController } from './lobbies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lobby } from '../typeorm/entities/Lobby';
import { User } from '../typeorm/entities/User';

@Module({
  imports: [TypeOrmModule.forFeature([Lobby, User])],
  controllers: [LobbiesController],
  providers: [LobbiesService],
})
export class LobbiesModule {}

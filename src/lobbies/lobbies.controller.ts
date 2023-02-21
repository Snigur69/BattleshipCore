import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';

import { CreateLobbyDto } from './dto/create-lobby.dto';
import { JoinLobbyDto } from './dto/join-lobby.dto';
import { LeaveLobbyDto } from './dto/leave-lobby.dto';
import { StartLobbyDto } from './dto/start-lobby.dto';
import { LobbiesService } from './lobbies.service';

@Controller('lobbies')
export class LobbiesController {
  constructor(private readonly lobbiesService: LobbiesService) {}

  @Post('/create')
  create(@Body() createLobbyDto: CreateLobbyDto) {
    return this.lobbiesService.create(createLobbyDto);
  }

  @Get()
  getAll() {
    return this.lobbiesService.getAll();
  }

  @Put('/join')
  join(@Body() joinLobbyDto: JoinLobbyDto) {
    return this.lobbiesService.join(joinLobbyDto);
  }

  @Put('/leave')
  leave(@Body() leaveLobbyDto: LeaveLobbyDto) {
    return this.lobbiesService.leave(leaveLobbyDto);
  }

  @Get('/:id')
  getOne(@Param('id') lobbyId: string) {
    return this.lobbiesService.getOne(lobbyId);
  }

  @Put('/start')
  start(@Body() startLobbyDto: StartLobbyDto) {
    return this.lobbiesService.start(startLobbyDto);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { LobbiesService } from './lobbies.service';
import { CreateLobbyDto } from './dto/create-lobby.dto';
import { JoinLobbyDto } from './dto/join-lobby.dto';
import { LeaveLobbyDto } from './dto/leave-lobby.dto';

@Controller('lobbies')
export class LobbiesController {
  constructor(private readonly lobbiesService: LobbiesService) {}

  @Post('/create')
  create(@Body() createLobbyDto: CreateLobbyDto) {
    return this.lobbiesService.create(createLobbyDto);
  }

  @Get()
  findAll() {
    return this.lobbiesService.findAll();
  }

  @Put('/join')
  join(@Body() joinLobbyDto: JoinLobbyDto) {
    return this.lobbiesService.join(joinLobbyDto);
  }

  @Put('/leave')
  leave(@Body() leaveLobbyDto: LeaveLobbyDto) {
    return this.lobbiesService.leave(leaveLobbyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lobbiesService.remove(+id);
  }
}

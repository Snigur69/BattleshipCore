import { Injectable } from '@nestjs/common';
import { CreateLobbyDto } from './dto/create-lobby.dto';
import { JoinLobbyDto } from './dto/join-lobby.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Lobby } from '../typeorm/entities/Lobby';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../typeorm/entities/User';

@Injectable()
export class LobbiesService {
  constructor(
    @InjectRepository(Lobby) private lobbyRepository: Repository<Lobby>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create({ userId, name, team }: CreateLobbyDto) {
    const lobbyId = uuidv4();
    const { username } = await this.userRepository.findOneById(userId);

    if (!username) {
      throw new Error('User does not exist!');
    }

    // TODO: Maybe move it to the separate table (LobbyParticipants)
    const participants = JSON.stringify([
      {
        userId,
        username,
        team,
        status: 'Unready', //TODO: add to the enum
        ships: null,
      },
    ]);

    const newLobby = this.lobbyRepository.create({
      id: lobbyId,
      name,
      participants,
      createdBy: userId,
      status: 'Pending', //TODO: move to enum
      messages: null,
    });

    return this.lobbyRepository.save(newLobby);
  }

  findAll() {
    return this.lobbyRepository.find(); //TODO: Maybe return only array of ids and names
  }

  async join({ lobbyId, userId }: JoinLobbyDto) {
    const { username } = await this.userRepository.findOneById(userId);

    if (!username) {
      throw new Error('User does not exist!');
    }

    const lobby = await this.lobbyRepository.findOneById(lobbyId);

    if (!lobby) {
      throw new Error('Lobby does not exist!');
    }

    const participants = JSON.parse(lobby.participants);
    const isUserInLobby = participants.find((el) => el.userId === userId);

    if (isUserInLobby) {
      throw new Error('User is already in lobby!');
    }

    if (participants.length === 2) {
      throw new Error('Lobby is full!');
    }

    const [userInLobby] = participants;
    const { team } = userInLobby;
    const availableTeam = team === 'red' ? 'blue' : 'red';
    const newParticipant = {
      userId,
      username,
      team: availableTeam,
      status: 'Unready',
      ships: null,
    };
    const newParticipants = JSON.stringify([...participants, newParticipant]);

    this.lobbyRepository.update(
      { id: lobbyId },
      { participants: newParticipants },
    );

    return { ...lobby, participants: newParticipants };
  }

  remove(id: number) {
    return `This action removes a #${id} lobby`;
  }
}

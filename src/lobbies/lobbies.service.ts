import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { LobbyErrors, UserErrors } from '../enums/errors';
import { LobbyStatuses, Teams } from '../enums/lobby';
import { UserStatuses } from '../enums/user';
import { Lobby } from '../typeorm/entities/Lobby';
import { User } from '../typeorm/entities/User';

import { CreateLobbyDto } from './dto/create-lobby.dto';
import { JoinLobbyDto } from './dto/join-lobby.dto';
import { LeaveLobbyDto } from './dto/leave-lobby.dto';
import { StartLobbyDto } from './dto/start-lobby.dto';

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
      throw new Error(UserErrors.NotExist);
    }

    // TODO: Maybe move it to the separate table (LobbyParticipants)
    const participants = JSON.stringify([
      {
        userId,
        username,
        team,
        status: UserStatuses.Unready,
        ships: null,
      },
    ]);

    const newLobby = this.lobbyRepository.create({
      id: lobbyId,
      name,
      participants,
      createdBy: userId,
      status: LobbyStatuses.Pending,
      messages: null,
    });

    return this.lobbyRepository.save(newLobby);
  }

  getAll() {
    return this.lobbyRepository.find(); //TODO: Maybe return only array of ids and names
  }

  async join({ lobbyId, userId }: JoinLobbyDto) {
    const { username } = await this.userRepository.findOneById(userId);

    if (!username) {
      throw new Error(UserErrors.NotExist);
    }

    const lobby = await this.lobbyRepository.findOneById(lobbyId);

    if (!lobby) {
      throw new Error(LobbyErrors.NotExist);
    }

    const participants = JSON.parse(lobby.participants);
    const isUserInLobby = participants.find((el) => el.userId === userId);

    if (isUserInLobby) {
      throw new Error(UserErrors.AlreadyInLobby);
    }

    if (participants.length === 2) {
      throw new Error(LobbyErrors.LobbyIsFull);
    }

    const [userInLobby] = participants;
    const { team } = userInLobby;
    const availableTeam = team === Teams.Red ? Teams.Blue : Teams.Red;
    const participant = {
      userId,
      username,
      team: availableTeam,
      status: UserStatuses.Unready,
      ships: null,
    };
    const newParticipants = {
      participants: JSON.stringify([...participants, participant]),
    };

    await this.lobbyRepository.update({ id: lobbyId }, newParticipants);

    return { ...lobby, ...newParticipants };
  }

  async leave({ lobbyId, userId }: LeaveLobbyDto) {
    const lobby = await this.lobbyRepository.findOneById(lobbyId);

    if (!lobby) {
      throw new Error(LobbyErrors.NotExist);
    }

    const filteredParticipants = JSON.parse(lobby.participants).filter(
      (participant) => participant.userId !== userId,
    );

    if (!filteredParticipants.length) {
      await this.lobbyRepository.delete(lobbyId);
    } else {
      await this.lobbyRepository.update(
        { id: lobbyId },
        { participants: JSON.stringify(filteredParticipants) },
      );
    }

    return { message: 'You left the lobby' };
  }

  getOne(lobbyId: string) {
    const lobby = this.lobbyRepository.findOneById(lobbyId);

    if (!lobby) {
      throw new Error(LobbyErrors.NotExist);
    }

    return lobby;
  }

  async start({ lobbyId }: StartLobbyDto) {
    const lobby = await this.lobbyRepository.findOneById(lobbyId);

    if (!lobby) {
      throw new Error(LobbyErrors.NotExist);
    }

    const newStatus = { status: LobbyStatuses.Active };

    await this.lobbyRepository.update({ id: lobbyId }, newStatus);

    return { ...lobby, ...newStatus };
  }
}

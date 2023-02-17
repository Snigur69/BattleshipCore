import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'lobbyParticipants' })
export class LobbyParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lobbyId: string;

  @Column()
  userId: string;

  @Column()
  team: string;

  @Column()
  status: string;

  @Column()
  ships: string;
}

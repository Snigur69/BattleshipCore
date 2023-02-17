import { Column, Entity } from 'typeorm';

@Entity({ name: 'lobbies' })
export class Lobby {
  @Column({ primary: true, unique: true })
  id: string;

  @Column()
  name: string;

  @Column()
  participants: string;

  @Column()
  createdBy: string;

  @Column()
  status: string;

  @Column()
  messages: string;
}

import { Column, Entity } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @Column({ primary: true, unique: true })
  id: string;

  @Column({ unique: true })
  username: string;
}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { LobbiesModule } from './lobbies/lobbies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/entities/User';
import { Lobby } from './typeorm/entities/Lobby';
import { LobbyParticipant } from './typeorm/entities/LobbyParticipant';

@Module({
  imports: [
    UsersModule,
    LobbiesModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'rootroot',
      database: 'battleship',
      entities: [User, Lobby, LobbyParticipant],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

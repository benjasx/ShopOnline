import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

interface ConnectedClients {
  [id: string]: { socket: Socket; user: User };
}

@Injectable()
export class MessagesWsService {
  private connectedClients: ConnectedClients = {};
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async registerClient(client: Socket, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) throw new Error('User not found');
    if (!user.isActive) throw new Error('User is not active');
    this.getUserConnection(user);
    this.connectedClients[client.id] = { socket: client, user };
  }

  removeClient(clientId: string) {
    delete this.connectedClients[clientId];
  }

  getConnetedClients(): string[] {
    return Object.keys(this.connectedClients);
  }

  getUserFullName(socketId: string) {
    return this.connectedClients[socketId].user.fullName;
  }

  private getUserConnection(user: User) {
    for (const clientId of Object.keys(this.connectedClients)) {
      const connectedclient = this.connectedClients[clientId];
      if (connectedclient.user.id === user.id) {
        connectedclient.socket.disconnect();
        break;
      }
    }
  }
}

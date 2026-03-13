import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;
  constructor(private readonly messagesWsService: MessagesWsService) {}
  handleConnection(client: Socket) {
    /* console.log('Cliente conectado:', client.id); */
    const token = client.handshake.headers.autentication as string;
    console.log({ token });

    this.messagesWsService.registerClient(client);
    this.wss.emit(
      'clients-update',
      this.messagesWsService.getConnetedClients(),
    );
  }

  handleDisconnect(client: Socket) {
    /* console.log('Cliente Desconectado', client.id); */
    this.messagesWsService.removeClient(client.id);
    this.wss.emit(
      'clients-update',
      this.messagesWsService.getConnetedClients(),
    );
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    //! Emite solo al cliente que lo emitió
    /* client.emit('message-from-server', {
      fullName: 'Soy yo',
      message: payload.message || 'no-message',
    }); */

    //! Emite a todos los clientes menos al que lo emitió
    /*  client.broadcast.emit('message-from-server', {
      fullName: 'Soy yo',
      message: payload.message || 'no-message',
    }); */

    this.wss.emit('message-from-server', {
      fullName: 'Soy yo',
      message: payload.message || 'no-message',
    });
  }
}

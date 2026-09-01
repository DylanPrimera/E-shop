import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesWsService } from './messages-ws.service';
import { MessageDto } from './dtos/message-dto';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces';

@WebSocketGateway({ cors: true, namespace: 'messages' })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private jwtService: JwtService,
  ) {}

  handleConnection(client: Socket) {
    const token = this.extractHandshakeToken(client);

    this.messagesWsService.registerClient(client, token!);

    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClientConnection(client.id);

    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(
    @ConnectedSocket() client: Socket,
    @MessageBody(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        exceptionFactory: () =>
          new BadRequestException('Message not valid, check the data sent'),
      }),
    )
    payload: MessageDto,
  ) {
    this.wss.emit('message-from-server', {
      from: client.id,
      fullName: this.messagesWsService.getUserFullNameBySocketId(client.id),
      message: payload.message || ' xd',
    });
  }

  extractHandshakeToken(client: Socket) {
    let payload: JwtPayload;
    try {
      const authorization = client.handshake.headers['authorization'] as string;
      payload = this.jwtService.verify(authorization);
      return payload;
    } catch {
      client.disconnect();
      return;
    }
  }
}

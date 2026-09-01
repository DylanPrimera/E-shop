import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../auth/interfaces';
import { Socket } from 'socket.io';

interface ConnectedClients {
  [id: string]: {
    socket: Socket;
    user: JwtPayload;
  };
}

@Injectable()
export class MessagesWsService {
  private connectedClients: ConnectedClients = {};

  registerClient(client: Socket, user: JwtPayload) {
    this.checkUserConnection(client);
    this.connectedClients[client.id] = { socket: client, user };
  }

  removeClientConnection(clientId: string) {
    delete this.connectedClients[clientId];
  }

  getConnectedClients() {
    if (Object.keys(this.connectedClients).length === 0) return [];
    const clients = Object.keys(this.connectedClients).map((clientId) => {
      const client = this.connectedClients[clientId];
      return {
        clientId: client.socket.id,
        user: client.user,
      };
    });
    return clients;
  }

  getUserFullNameBySocketId(socketId: string): string | null {
    const client = this.connectedClients[socketId];
    if (!client) return null;
    return client.user.fullName;
  }

  private checkUserConnection(client: Socket) {
    for (const clientId of Object.keys(this.connectedClients)) {
      const connectedClient = this.connectedClients[clientId];
      if (clientId === client.id) {
        connectedClient.socket.disconnect();
        return;
      }
    }
  }
}

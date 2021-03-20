import WebSocket, { Server } from 'ws';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { generateJsonRpcNotification } from '../../helpers/json-rpc.utils';

@WebSocketGateway()
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: WebSocket): void {
    this.server.clients.add(client);
  }

  handleDisconnect(client: WebSocket): void {
    this.server.clients.delete(client);
    this.broadcast('disconnect');
  }

  private broadcast(
    event: string,
    options?: { except?: WebSocket[]; params?: unknown[] },
  ): void {
    this.server.clients.forEach((client) => {
      if (options?.except && !options.except.find((c) => c === client)) {
        const message = generateJsonRpcNotification(event, options.params);
        client.send(JSON.stringify(message));
      }
    });
  }

  @SubscribeMessage('getNewMessages')
  findAll(@MessageBody() data: string, @ConnectedSocket() socket: WebSocket): string {
    return 'New messages';
  }

  @SubscribeMessage('save')
  async identity(
    @MessageBody() data: Record<string, unknown>,
    @ConnectedSocket() socket: WebSocket,
  ): Promise<Record<string, unknown>> {
    this.broadcast('newMessage', { except: [socket] });
    return data;
  }
}

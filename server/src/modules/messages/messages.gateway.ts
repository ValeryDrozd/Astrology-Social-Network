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
import broadcast from 'src/helpers/broadcast';

@WebSocketGateway()
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: WebSocket): void {
    this.server.clients.add(client);
  }

  handleDisconnect(client: WebSocket): void {
    this.server.clients.delete(client);
    broadcast(this.server, 'disconnect');
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
    broadcast(this.server, 'newMessage', { except: [socket] });
    return data;
  }
}

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
import { MessagesService } from './messages.service';
import Message from '../../../../interfaces/message.entity';

@WebSocketGateway()
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(private messagesService: MessagesService) {}

  handleConnection(client: WebSocket): void {
    this.server.clients.add(client);
  }

  handleDisconnect(client: WebSocket): void {
    this.server.clients.delete(client);
    broadcast(this.server, 'disconnect');
  }

  @SubscribeMessage('getMessages')
  getMessages(
    @MessageBody() data: string,
    @ConnectedSocket() socket: WebSocket,
  ): Message[] {
    return this.messagesService.getMessages();
  }

  @SubscribeMessage('addNewMessage')
  async save(
    @MessageBody() message: Message,
    @ConnectedSocket() socket: WebSocket,
  ): Promise<{ ok: boolean }> {
    this.messagesService.addNewMessage(message);
    broadcast(this.server, 'newMessage', { except: [socket], params: message });
    return { ok: true };
  }
}

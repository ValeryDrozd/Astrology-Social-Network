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
import broadcast from 'src/helpers/broadcast';
import { MessagesService } from './messages.service';
import Message from '../../../../client/src/interfaces/message';
import {
  AddNewMessageFunction,
  DeliveredEvent,
  GetMessagesFunction,
  GetMessagesFunctionResponse,
  NewMessageNotification,
  NewMessageNotificationParams,
} from '../../../../client/src/interfaces/rpc-events';

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

  @SubscribeMessage(GetMessagesFunction)
  getMessages(
    @MessageBody() data: string,
    @ConnectedSocket() socket: WebSocket,
  ): GetMessagesFunctionResponse {
    return this.messagesService.getChats();
  }

  @SubscribeMessage(AddNewMessageFunction)
  async save(
    @MessageBody() message: Message,
    @ConnectedSocket() socket: WebSocket,
  ): Promise<DeliveredEvent> {
    //message
    this.messagesService.addNewMessage(message);
    broadcast<NewMessageNotificationParams>(this.server, NewMessageNotification, {
      except: [socket],
      params: message,
    });
    return { ok: true };
  }
}

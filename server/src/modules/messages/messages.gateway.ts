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
import Message from '../../../../interfaces/message.entity';
import {
  AddNewMessageFunction,
  DeliveredEvent,
  GetMessagesFunction,
  GetMessagesFunctionResponse,
  NewMessageNotification,
  NewMessageNotificationParams,
} from '../../../../interfaces/rpc-events';
import { IncomingMessage } from 'http';
import * as cookie from 'cookie';

interface MessagesSession {
  socket: WebSocket;
  token: string;
}

@WebSocketGateway({ path: '/messages' })
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private clients: MessagesSession[] = [];

  constructor(private messagesService: MessagesService) {}

  handleConnection(client: WebSocket, request: IncomingMessage): void {
    const { cookie: requestCookie } = request.headers;
    const token = cookie.parse(requestCookie ? requestCookie : '').token;

    if (!requestCookie || !token) {
      return client.close(1014);
    }

    const session: MessagesSession = {
      token,
      socket: client,
    };

    this.clients.push(session);
  }

  handleDisconnect(client: WebSocket): void {
    this.clients.splice(
      this.clients.findIndex((c) => c.socket === client),
      1,
    );
    console.log(this.clients)
    broadcast(this.server, 'disconnect');
  }

  @SubscribeMessage(GetMessagesFunction)
  getMessages(
    @MessageBody() data: string,
    @ConnectedSocket() socket: WebSocket,
  ): GetMessagesFunctionResponse {
    return this.messagesService.getMessages();
  }

  @SubscribeMessage(AddNewMessageFunction)
  async save(
    @MessageBody() message: Message,
    @ConnectedSocket() socket: WebSocket,
  ): Promise<DeliveredEvent> {
    this.messagesService.addNewMessage(message);
    broadcast<NewMessageNotificationParams>(this.server, NewMessageNotification, {
      except: [socket],
      params: message,
    });
    return { ok: true };
  }
}

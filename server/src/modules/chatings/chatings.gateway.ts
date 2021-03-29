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
import { ChatingsService } from './chatings.service';
import { NewMessage } from '../../../../client/src/interfaces/new-message';
import {
  AddNewMessageFunction,
  DeliveredEvent,
  GetMessagesFunction,
  GetMessagesFunctionResponse,
  NewMessageNotification,
  NewMessageNotificationParams,
} from '../../../../client/src/interfaces/rpc-events';
import { IncomingMessage } from 'http';
import * as cookie from 'cookie';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { ChatsService } from '../chats/chats.service';

interface ChatingSession {
  socket: WebSocket;
  userID: string;
  token: string;
}

@WebSocketGateway({ path: '/chating' })
export class ChatingsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private clients: ChatingSession[] = [];

  constructor(
    private chatingsService: ChatingsService,
    private jwtService: JwtService,
    private chatsService: ChatsService,
  ) {}

  handleConnection(client: WebSocket, request: IncomingMessage): void {
    const accessToken = cookie.parse(request.headers.cookie ? request.headers.cookie : '')
      .accessToken;
    try {
      if (!accessToken) {
        throw new Error();
      }
      const res = this.jwtService.verify(accessToken);

      const session: ChatingSession = {
        token: accessToken,
        userID: res.userID,
        socket: client,
      };

      this.clients.push(session);
    } catch (error) {
      client.close(1014);
    }
  }

  handleDisconnect(client: WebSocket): void {
    this.clients.splice(
      this.clients.findIndex((c) => c.socket === client),
      1,
    );
  }

  @SubscribeMessage(GetMessagesFunction)
  async getMessages(
    @MessageBody() data: string,
    @ConnectedSocket() socket: WebSocket,
  ): Promise<GetMessagesFunctionResponse> {
    const session = this.clients.find((client) => client.socket === socket);
    if (!session) {
      throw new UnauthorizedException('INVALID TOKEN!');
    }

    this.jwtService.verify(session.token);

    return await this.chatingsService.getChats(session.userID);
  }

  @SubscribeMessage(AddNewMessageFunction)
  async save(
    @MessageBody() message: NewMessage,
    @ConnectedSocket() socket: WebSocket,
  ): Promise<DeliveredEvent> {
    const session = this.clients.find((client) => client.socket === socket);
    if (!session) {
      return { ok: false, err: 'INVALID TOKEN!' };
    }

    this.jwtService.verify(session.token);
    await this.chatingsService.addNewMessage(message);

    const userIDs = (await this.chatsService.findUsersOfChat(message.chatID)).map(
      ({ userID }) => userID,
    );

    const recievers = this.clients
      .filter((client) => userIDs.includes(client.userID))
      .map(({ socket }) => socket);
    broadcast<NewMessageNotificationParams>(NewMessageNotification, recievers, message);
    return { ok: true };
  }
}

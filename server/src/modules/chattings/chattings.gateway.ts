import WebSocket, { Server } from 'ws';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import broadcast from 'src/helpers/broadcast';
import { ChattingSession, ChattingsService } from './chattings.service';
import { NewMessage } from '@interfaces/new-message';
import {
  AddNewMessageFunction,
  ConnectionStatusNotification,
  ConnectionStatusNotificationPayload,
  DeliveredEvent,
  GetMessagesFunction,
  GetMessagesFunctionResponse,
  NewMessageNotification,
  NewMessageNotificationParams,
} from '@interfaces/rpc-events';
import { IncomingMessage } from 'http';
import * as cookie from 'cookie';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, UseFilters, WsExceptionFilter } from '@nestjs/common';
import { ChatsService } from '../chats/chats.service';
import {
  generateJsonRpcError,
  generateJsonRpcNotification,
} from 'src/helpers/json-rpc.utils';
import { ErrorType } from '@interfaces/json-rpc';
const invalidTokenError = { error: { code: -32600, message: 'INVALID TOKEN!' } };

@WebSocketGateway({ path: '/chating' })
export class ChattingsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(
    private chatingsService: ChattingsService,
    private jwtService: JwtService,
    private chatsService: ChatsService,
  ) {}

  handleConnection(client: WebSocket, request: IncomingMessage): void {
    const accessToken = cookie.parse(request.headers.cookie ? request.headers.cookie : '')
      .accessToken;

    const sendResponse = (payload: ConnectionStatusNotificationPayload): void => {
      client.send(
        JSON.stringify(
          generateJsonRpcNotification(ConnectionStatusNotification, payload),
        ),
      );
    };
    try {
      if (!accessToken) {
        throw new Error();
      }
      const res = this.jwtService.verify(accessToken);

      const session: ChattingSession = {
        token: accessToken,
        userID: res.userID,
        socket: client,
      };

      this.chatingsService.addNewSession(session);
      sendResponse({ ok: true });
    } catch (error) {
      sendResponse({ ok: false, code: -32600, message: 'INVALID TOKEN' });
      return client.close(1014);
    }
  }

  handleDisconnect(client: WebSocket): void {
    this.chatingsService.removeSession(client);
  }

  @SubscribeMessage(GetMessagesFunction)
  async getMessages(
    @MessageBody() data: string,
    @ConnectedSocket() socket: WebSocket,
  ): Promise<GetMessagesFunctionResponse | { error: ErrorType }> {
    const session = this.chatingsService.getSession(socket);
    try {
      if (!session) {
        throw new Error();
      }

      this.jwtService.verify(session.token);

      return await this.chatingsService.getChats(session.userID);
    } catch (error) {
      return invalidTokenError;
    }
  }

  @SubscribeMessage(AddNewMessageFunction)
  async save(
    @MessageBody() message: NewMessage,
    @ConnectedSocket() socket: WebSocket,
  ): Promise<DeliveredEvent | { error: ErrorType }> {
    const session = this.chatingsService.getSession(socket);
    try {
      if (!session) {
        return { ok: false, error: 'INVALID TOKEN!' };
      }

      this.jwtService.verify(session.token);
      await this.chatingsService.addNewMessage(message);

      const userIDs = (await this.chatsService.findUsersOfChat(message.chatID)).map(
        ({ userID }) => userID,
      );

      const recievers = this.chatingsService
        .getSessions()
        .filter((client) => userIDs.includes(client.userID))
        .map(({ socket }) => socket);
      broadcast<NewMessageNotificationParams>(NewMessageNotification, recievers, message);
      return { ok: true };
    } catch (error) {
      return invalidTokenError;
    }
  }
}

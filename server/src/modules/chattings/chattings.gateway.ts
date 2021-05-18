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
import { ChattingSession, ChattingsService } from './chattings.service';
import { NewMessage } from '@interfaces/new-message';
import {
  AddNewChatFunction,
  AddNewChatParams,
  AddNewMessageFunction,
  ConnectionStatusNotification,
  ConnectionStatusNotificationPayload,
  DeliveredEvent,
  GetMessagesFunction,
  GetMessagesFunctionResponse,
  NewChatNotification,
  NewChatNotificationParams,
  NewMessageNotification,
  NewMessageNotificationParams,
} from '@interfaces/rpc-events';
import { IncomingMessage } from 'http';
import * as cookie from 'cookie';
import { JwtService } from '@nestjs/jwt';
import { ChatsService } from '../chats/chats.service';
import { generateJsonRpcNotification } from 'src/helpers/json-rpc.utils';
import { ErrorType, JsonRpcErrorCodes } from '@interfaces/json-rpc';
import { UnauthorizedException } from '@nestjs/common';
import Chat from '@interfaces/chat';

const invalidTokenError = {
  error: { code: JsonRpcErrorCodes.INVALID_REQUEST, message: 'INVALID TOKEN!' },
};

@WebSocketGateway({ path: '/chattings' })
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
        throw new UnauthorizedException();
      }

      this.jwtService.verify(session.token);
      await this.chatingsService.addNewMessage(message);

      const userIDs = (await this.chatsService.findUsersOfChat(message.chatID)).map(
        ({ userID }) => userID,
      );

      const recievers = this.chatingsService
        .getSessions()
        .filter(
          (client) => userIDs.includes(client.userID) && client.token !== session.token,
        )
        .map(({ socket }) => socket);
      broadcast<NewMessageNotificationParams>(NewMessageNotification, recievers, message);
      return { ok: true };
    } catch (error) {
      return invalidTokenError;
    }
  }
  @SubscribeMessage(AddNewChatFunction)
  async createNewChat(
    @MessageBody() { memberID }: AddNewChatParams,
    @ConnectedSocket() socket: WebSocket,
  ): Promise<Chat | { error: ErrorType }> {
    const session = this.chatingsService.getSession(socket);
    try {
      if (!session) {
        throw new UnauthorizedException();
      }

      this.jwtService.verify(session.token);
      const oldChatID = await this.chatsService.checkChat(session.userID, memberID);
      if (oldChatID) {
        return {
          error: { code: JsonRpcErrorCodes.INVALID_PARAMS, message: 'CHAT EXISTS!' },
        };
      }

      const userIDs = [memberID, session.userID];
      const newChat = await this.chatsService.createNewChat(session.userID, memberID);

      const recievers = this.chatingsService
        .getSessions()
        .reduce<WebSocket[]>(
          (prev, client) =>
            userIDs.includes(client.userID) && client.token !== session.token
              ? [...prev, client.socket]
              : prev,
          [],
        );
      broadcast<NewChatNotificationParams>(NewChatNotification, recievers, newChat);
      return newChat;
    } catch (error) {
      return invalidTokenError;
    }
  }
}

import { Injectable } from '@nestjs/common';
import Chat from '@interfaces/chat';
import { ChatsService } from '../chats/chats.service';
import { NewMessage } from '@interfaces/new-message';
import { MessagesService } from '../messages/messages.service';
import WebSocket from 'ws';

export interface ChattingSession {
  socket: WebSocket;
  userID: string;
  token: string;
}

@Injectable()
export class ChattingsService {
  private sessions: ChattingSession[] = [];
  constructor(
    private chatsService: ChatsService,
    private messagesService: MessagesService,
  ) {}

  getSessions(): ChattingSession[] {
    return this.sessions;
  }

  addNewSession(session: ChattingSession): void {
    this.sessions.push(session);
  }

  removeSession(socket: WebSocket): void {
    const index = this.sessions.findIndex((s) => s.socket === socket);
    this.sessions.splice(index, 1);
  }

  getSession(socket: WebSocket): ChattingSession | undefined {
    return this.sessions.find((s) => s.socket === socket);
  }

  async getChats(userID: string): Promise<Chat[]> {
    return await this.chatsService.findMyChatsWithMessages(userID);
  }

  //Add to parametes message: Message
  async addNewMessage(message: NewMessage): Promise<void> {
    await this.messagesService.addNewMessage(message);
  }
}

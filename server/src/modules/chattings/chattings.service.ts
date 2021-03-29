import { Injectable } from '@nestjs/common';
import Message from '@interfaces/message';
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

  private messages: Message[] = [
    {
      text: 'string4',
      time: new Date(),
      messageID: '5',
      isSent: true,
      senderID: '2',
    },
    {
      text: 'string22',
      time: new Date(),
      messageID: '1',
      isSent: true,
      senderID: '1',
    },
    {
      text: 'string2',
      time: new Date(),
      messageID: '2',
      isSent: true,
      senderID: '1',
    },
    {
      text: 'string2',
      time: new Date(),
      messageID: '3',
      isSent: true,
      senderID: '1',
    },
    {
      text: 'string1',
      time: new Date(),
      messageID: '4',
      isSent: true,
      senderID: '1',
    },
    {
      text: 'string22asq8',
      time: new Date(),
      messageID: '9',
      isSent: true,
      senderID: '1',
    },
  ];

  chats: Chat[] = [
    {
      messageList: this.messages,
      chatID: '1',
      senderInfo: {
        firstName: 'Michael',
        lastName: 'Medvediev',
        senderID: '2',
      },
    },
    {
      messageList: [],
      chatID: '2',
      senderInfo: {
        firstName: 'Mishanya',
        lastName: 'Medvediev',
        senderID: '3',
      },
    },
  ];

  async getChats(userID: string): Promise<Chat[]> {
    return await this.chatsService.findMyChatsWithMessages(userID);
  }

  getMessages(): Message[] {
    console.log('Getting messages');
    return this.messages;
  }
  //Add to parametes message: Message
  async addNewMessage(message: NewMessage): Promise<void> {
    await this.messagesService.addNewMessage(message);
  }
}

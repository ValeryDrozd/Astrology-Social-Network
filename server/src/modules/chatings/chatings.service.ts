import { Injectable } from '@nestjs/common';
import Message from '@interfaces/message';
import Chat from '@interfaces/chat';
import { ChatsService } from '../chats/chats.service';
import { NewMessage } from '@interfaces/new-message';
import { MessagesService } from '../messages/messages.service';

@Injectable()
export class ChatingsService {
  constructor(
    private chatsService: ChatsService,
    private messagesService: MessagesService,
  ) {}
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

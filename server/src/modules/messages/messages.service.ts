import { Injectable } from '@nestjs/common';
import Message from '../../../../client/src/interfaces/message';
import Chat from '../../../../client/src/interfaces/chat';

@Injectable()
export class MessagesService {
  private messages: Message[] = [
    {
      text: 'string',
      time: new Date(),
      id: 1,
      isSent: true,
      senderId: 1,
    },
    {
      text: 'string2',
      time: new Date(),
      id: 2,
      isSent: true,
      senderId: 1,
    },
    {
      text: 'string2',
      time: new Date(),
      id: 3,
      isSent: true,
      senderId: 1,
    },
    {
      text: 'string1',
      time: new Date(),
      id: 4,
      isSent: true,
      senderId: 1,
    },
  ];

  chats: Chat[] = [
    {
      messageList: this.messages,
      chatId: 1,
      senderInfo: [
        {
          nameUser: 'Valery',
          userID: 1,
        },
        {
          nameUser: 'Michael',
          userID: 2,
        },
      ],
    },
  ];

  getChats(): Chat[] {
    return this.chats;
  }

  getMessages(): Message[] {
    return this.messages;
  }
  //Add to parametes message: Message
  addNewMessage(message: Message): void {
    this.messages.push(message);
    //console.log('Pushed');
  }
}

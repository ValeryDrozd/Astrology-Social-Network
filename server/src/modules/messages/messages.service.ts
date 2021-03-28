import { Injectable } from '@nestjs/common';
import Message from '../../../../client/src/interfaces/message';
import Chat from '../../../../client/src/interfaces/chat';

@Injectable()
export class MessagesService {
  private messages: Message[] = [
    {
      text: 'string4',
      time: new Date(),
      id: 5,
      isSent: true,
      senderId: 2,
    },
    {
      text: 'string22',
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
    {
      text: 'string22asq8',
      time: new Date(),
      id: 9,
      isSent: true,
      senderId: 1,
    },
  ];

  chats: Chat[] = [
    {
      messageList: this.messages,
      chatId: 1,
      senderInfo: {
        nameUser: 'Michael',
        userID: 2,
      },
    },
    {
      messageList: [],
      chatId: 2,
      senderInfo: {
        nameUser: 'Mishanya',
        userID: 3,
      },
    },
    
  ];

  getChats(): Chat[] {
    return this.chats;
  }

  getMessages(): Message[] {
    console.log('Getting messages');
    return this.messages;
  }
  //Add to parametes message: Message
  addNewMessage(message: Message): void {
    console.log('Old message', message);
    message.id = this.messages.length + 10;
    this.messages.push(message);
    console.log('This.messageList ', this.messages);
    console.log('Last message', message);
  }
}

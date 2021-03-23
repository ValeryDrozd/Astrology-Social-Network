import { Injectable } from '@nestjs/common';
import Message from '../../../../client/src/interfaces/message.entity';

@Injectable()
export class MessagesService {
  private messages: Message[] = [
    {
      text: 'string',
      time: 'string',
      id: 'string',
    },
    {
      text: 'string1',
      time: 'string1',
      id: 'string1',
    },
  ];

  getMessages(): Message[] {
    return this.messages;
  }

  addNewMessage(message: Message): void {
    this.messages.push(message);
  }
}

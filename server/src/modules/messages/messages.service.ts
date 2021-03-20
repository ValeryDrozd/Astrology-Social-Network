import { Injectable } from '@nestjs/common';
import Message from '../../../../interfaces/message.entity';

@Injectable()
export class MessagesService {
  private messages: Message[] = [];

  getMessages(): Message[] {
    return this.messages;
  }

  addNewMessage(message: Message): void {
    this.messages.push(message);
  }
}

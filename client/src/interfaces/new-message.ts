import Message from './message';

export interface NewMessage extends Message {
  chatId: string;
}

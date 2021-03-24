import Message from './message';
import User from './user';

export default interface Chat {
  messageList: Message[];
  chatId: number;
  senderInfo: User[];
}

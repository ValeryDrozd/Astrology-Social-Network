import Message from './message';

interface SenderInfo {
  firstName: string;
  lastName: string;
  senderID: string;
}

export default interface Chat {
  messageList: Message[];
  chatID: string;
  senderInfo: SenderInfo;
}

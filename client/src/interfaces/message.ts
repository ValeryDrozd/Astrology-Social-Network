import Chat from './chat';

export default interface Message {
  id: number;
  text: string;
  time: Date;
  isSent: boolean;
  senderId: number;
}

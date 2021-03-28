export default interface Message {
  id: string;
  text: string;
  time: Date;
  isSent: boolean;
  senderId: number;
}

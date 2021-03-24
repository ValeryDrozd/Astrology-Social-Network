import { observable } from 'mobx';
import WebSocketClient, { createRpcConnection } from '../socket';
import Chat from '../interfaces/chat';
import { NewMessage } from '../interfaces/new-message';
import {
  GetMessagesFunction,
  GetMessagesFunctionResponse,
} from '../interfaces/rpc-events';

export default class ChatStore {
  @observable messagesQueue: NewMessage[] = [];
  @observable chats: Chat[] = [];
  @observable number = 1;
  private socket: WebSocketClient | undefined;

  // constructor() {}s

  async init(): Promise<void> {
    createRpcConnection().then(async (socket: WebSocketClient) => {
      this.socket = socket;
      const chats = await socket.call<GetMessagesFunctionResponse>(
        GetMessagesFunction,
      );
      console.log(chats);
      this.chats = [...chats];
      setTimeout(() => {
        this.number = 2;
      }, 1000);
    });
  }

  addMessage(chatId: number, text: string, time: Date, senderId: number): void {
    const message: NewMessage = {
      id: 1,
      chatId: chatId,
      senderId: senderId,
      time: time,
      isSent: false,
      text: text,
    };
    this.messagesQueue = [...this.messagesQueue, message];
    this.sendMessages();
  }

  removeMessage(): void {
    const localStorageValue =
      localStorage.getItem('queue') == null
        ? '[]'
        : (localStorage.getItem('queue') as string);
    this.messagesQueue = JSON.parse(localStorageValue);
    localStorage.removeItem('queue');
    this.sendMessages();
  }

  sendMessages(): void {
    const i = 0;
  }

  saveQueue(): void {
    localStorage.setItem('queue', JSON.stringify(this.messagesQueue));
  }

  // sendMessage(): void {}

  // addNewChat(): void {}
}

import { makeAutoObservable } from 'mobx';
import WebSocketClient from '../socket';
import Chat from '../interfaces/chat';
import { NewMessage } from '../interfaces/new-message';
import {
  GetMessagesFunction,
  GetMessagesFunctionResponse,
} from '../interfaces/rpc-events';

class ChatStore {
  messagesQueue: NewMessage[] = [];
  chats: Chat[] = [];
  number = 1;
  online = false;
  private socket = new WebSocketClient();

  constructor() {
    this.socket.listenTo('open', () => {
      this.online = true;
      this.getMessages();
    });
    this.socket.listenTo('close', () => {
      this.online = false;
    });
  }

  async getMessages(): Promise<void> {
    this.chats = await this.socket.call<GetMessagesFunctionResponse>(
      GetMessagesFunction,
    );
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
    //const i = 0;
  }

  saveQueue(): void {
    localStorage.setItem('queue', JSON.stringify(this.messagesQueue));
  }

  // addNewChat(): void {}
}

export default makeAutoObservable(new ChatStore());

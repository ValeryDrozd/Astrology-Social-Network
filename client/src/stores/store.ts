import { makeAutoObservable } from 'mobx';
import WebSocketClient from '../socket';
import Chat from '../interfaces/chat';
import { NewMessage } from '../interfaces/new-message';
import { v4 as uuid } from 'uuid';
import {
  AddNewMessageFunction,
  GetMessagesFunction,
  GetMessagesFunctionResponse,
  NewMessageNotification,
} from '../interfaces/rpc-events';

class ChatStore {
  messagesQueue: NewMessage[] = [];
  chats: Chat[] = [];
  number = 1;
  online = false;
  myID = 1;
  private socket = new WebSocketClient();

  constructor() {
    this.socket.listenTo('open', () => {
      this.online = true;
      this.getMessages();
    });
    this.socket.listenTo(NewMessageNotification, () => {
      // alert('New messages');
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

  addMessage(chatId: string, text: string, senderId: number): void {
    console.log(text);
    const id = uuid();
    const message: NewMessage = {
      id,
      chatId: chatId,
      senderId: senderId,
      time: new Date(),
      isSent: false,
      text: text,
    };
    this.messagesQueue = [...this.messagesQueue, message];
    this.chats
      .find((chat) => chat.chatId === chatId)
      ?.messageList.push(message);
    // this.sendMessages();
  }

  // addChat(senderInfo:):void {
  //   const chatId = uuid();
  //   const chat: Chat = {
  //     chatId,
  //     senderInfo: {

  //     }

  //   };
  // }

  removeMessage(): void {
    const localStorageValue =
      localStorage.getItem('queue') == null
        ? '[]'
        : (localStorage.getItem('queue') as string);
    this.messagesQueue = JSON.parse(localStorageValue);
    localStorage.removeItem('queue');
    this.sendMessages();
  }

  sendOneMessage(msg: NewMessage): void {
    console.log('OneMsg', msg);
    this.socket.call(AddNewMessageFunction, msg);
  }

  sendMessages(): void {
    this.messagesQueue.forEach((message: NewMessage) => {
      this.sendOneMessage(message);
      this.messagesQueue.shift();
    });
    console.log('SenderMessage');
  }

  saveQueue(): void {
    localStorage.setItem('queue', JSON.stringify(this.messagesQueue));
  }

  // addNewChat(): void {}
}

export default makeAutoObservable(new ChatStore());

import { makeAutoObservable } from 'mobx';
import WebSocketClient from '../socket';
import Chat from '../interfaces/chat';
import { NewMessage } from '../interfaces/new-message';
import { v4 as uuid } from 'uuid';
import {
  AddNewMessageFunction,
  ConnectionStatusNotification,
  ConnectionStatusNotificationPayload,
  GetMessagesFunction,
  GetMessagesFunctionResponse,
  NewMessageNotification,
} from '../interfaces/rpc-events';
import Message, { ServerMessage } from '../interfaces/message';

class ChatStore {
  messagesQueue: NewMessage[] = [];
  chats: Chat[] = [];
  number = 1;
  online = false;
  myID = '05b47a75-2e21-4f05-aa31-3bed5e1f43e4';
  private socket = new WebSocketClient();

  constructor() {
    this.socket.listenTo('open', () => {
      this.online = true;
      this.socket
        .listenOnce<ConnectionStatusNotificationPayload>(
          ConnectionStatusNotification,
        )
        .then((res) => {
          if (!res.ok) {
            return; // TODO refresh tokens before connecting
          }
          this.getMessages();
        });
    });
    this.socket.listenTo(NewMessageNotification, () => {
      // alert('New messages');
    });
    this.socket.listenTo('close', (res) => {
      this.online = false;
    });
    this.socket.listenTo('error', (err) => {
      console.log(err);
    });
  }

  async getMessages(): Promise<void> {
    try {
      const res = await this.socket.call<GetMessagesFunctionResponse>(
        GetMessagesFunction,
      );
      this.chats = res;
    } catch (error) {
      console.log(error);
    }
  }

  addMessage(chatID: string, text: string, senderID: string): void {
    const id = uuid();
    const message: ServerMessage = {
      messageID: id,
      senderID,
      time: new Date(),
      text: text,
    };
    this.messagesQueue = [...this.messagesQueue, { ...message, chatID }];
    this.chats
      .find((chat) => chat.chatID === chatID)
      ?.messageList.push({ ...message, isSent: false });
    this.sendOneMessage({ ...message, chatID });
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

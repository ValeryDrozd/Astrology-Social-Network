import { makeAutoObservable } from 'mobx';
import WebSocketClient from '../socket';
import Chat from '../interfaces/chat';
import { NewMessage } from '../interfaces/new-message';
import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';
import {
  AddNewMessageFunction,
  ConnectionStatusNotification,
  ConnectionStatusNotificationPayload,
  GetMessagesFunction,
  GetMessagesFunctionResponse,
  NewMessageNotification,
  NewMessageNotificationParams,
} from '../interfaces/rpc-events';
import Message, { ServerMessage } from '../interfaces/message';
import { refresh } from '../services/auth.service';

class ChatStore {
  private accessToken!: string;
  messagesQueue: NewMessage[] = [];
  chats: Chat[] = [];
  number = 1;
  online = false;
  myID!: string;
  private socket!: WebSocketClient;

  constructor() {
    refresh().then(({ accessToken }): void => {
      this.setAccessToken(accessToken);
    });
  }

  initSocket(): void {
    this.socket = new WebSocketClient();
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

    this.socket.listenTo(
      NewMessageNotification,
      (message: NewMessageNotificationParams) => {
        this.chats
          .find((chat) => chat.chatID === message.chatID)
          ?.messageList.push({ ...message, isSent: false });
      },
    );
  }

  setAccessToken(accessToken: string): void {
    this.accessToken = accessToken;
    const res = this.checkToken();
    if (res) {
      this.myID = res.userID;
      this.initSocket();
      console.log(res);
    }
  }

  checkToken(): { userID: string; exp: number; iat: number } | undefined {
    try {
      return jwt.verify(
        this.accessToken,
        process.env.REACT_APP_JWT_SECRET as string,
      ) as { userID: string; exp: number; iat: number };
    } catch (error) {}
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

  addMessage(chatID: string, text: string): void {
    const id = uuid();
    console.log(this.myID);
    const message: ServerMessage = {
      messageID: id,
      senderID: this.myID,
      time: new Date(),
      text,
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

import { makeAutoObservable } from 'mobx';
import WebSocketClient from 'socket';
import Chat from 'interfaces/chat';
import { NewMessage } from 'interfaces/new-message';
import { v4 as uuid } from 'uuid';
import {
  AddNewMessageFunction,
  ConnectionStatusNotification,
  ConnectionStatusNotificationPayload,
  GetMessagesFunction,
  GetMessagesFunctionResponse,
  NewMessageNotification,
  NewMessageNotificationParams,
} from 'interfaces/rpc-events';
import { ServerMessage } from 'interfaces/message';
import { refresh } from 'services/auth.service';
import { getMyProfile } from 'services/users.service';
import User from 'interfaces/user';
import checkToken from 'helpers/check-token';

export class ChatStore {
  accessToken!: string;
  messagesQueue: NewMessage[] = [];
  chats: Chat[] = [];
  online = false;
  myID!: string;
  user!: User;
  initialized = false;
  private exp = 0;
  private socket!: WebSocketClient;

  constructor() {
    makeAutoObservable(this);
    refresh()
      .then(({ accessToken }): void => {
        this.setAccessToken(accessToken);
      })
      .catch(() => {
        this.online = false;
        this.initialized = true;
      });
  }

  setUser(newUserInfo: User): void {
    this.user = newUserInfo;
  }

  initSocket(): void {
    this.socket = new WebSocketClient();
    this.socket.listenTo('open', () => {
      this.online = true;
      this.socket
        .listenOnce<ConnectionStatusNotificationPayload>(
          ConnectionStatusNotification,
        )
        .then(async (res) => {
          if (!res.ok) {
            await this.checkValidToken();
          }

          await this.getMessages();
        });
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
          ?.messageList.push({ ...message, isSent: true });
      },
    );
  }

  async setAccessToken(accessToken: string): Promise<void> {
    this.accessToken = accessToken;
    const res = checkToken(accessToken);
    if (res) {
      this.myID = res.userID;
      this.exp = res.exp;
      await this.setMyProfile();
      this.initSocket();
    }
  }

  private async checkValidToken(): Promise<void> {
    if (Date.now() >= this.exp * 1000) {
      const { accessToken } = await refresh();
      this.accessToken = accessToken;
    }
  }

  async getMessages(): Promise<void> {
    try {
      await this.checkValidToken();
      const res = await this.socket.call<GetMessagesFunctionResponse>(
        GetMessagesFunction,
      );
      this.chats = res;
    } catch (error) {}
  }

  addMessage(chatID: string, text: string): void {
    const id = uuid();
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

  removeMessage(): void {
    const localStorageValue =
      localStorage.getItem('queue') == null
        ? '[]'
        : (localStorage.getItem('queue') as string);

    try {
      this.messagesQueue = JSON.parse(localStorageValue);
      localStorage.removeItem('queue');
      this.sendMessages();
    } catch (error) {}
  }

  async sendOneMessage(msg: NewMessage): Promise<void> {
    await this.checkValidToken();

    const res: { ok: boolean } = await this.socket.call(
      AddNewMessageFunction,
      msg,
    );
    if (res.ok) {
      const currentChat = this.chats.find((chat) => chat.chatID === msg.chatID);
      const currentIndex = currentChat?.messageList.findIndex(
        (message) => message.messageID === msg.messageID,
      );
      if (currentChat && currentIndex) {
        currentChat.messageList[currentIndex].isSent = true;
      }
    }
  }

  sendMessages(): void {
    this.messagesQueue.forEach((message: NewMessage) => {
      this.sendOneMessage(message);
      this.messagesQueue.shift();
    });
  }

  saveQueue(): void {
    localStorage.setItem('queue', JSON.stringify(this.messagesQueue));
  }

  async setMyProfile(): Promise<void> {
    try {
      const user = await getMyProfile(this.accessToken);
      this.user = user;
    } catch (err) {
    } finally {
      this.initialized = true;
    }
  }

  // addNewChat(): void {}
}

let chatStore = new ChatStore();

export function reloadChatStore(): void {
  chatStore = new ChatStore();
}

export default chatStore;

import { Client } from 'rpc-websockets';
import { IWSRequestParams } from 'rpc-websockets/dist/lib/client';
import 'dotenv/config';

export async function createRpcConnection(): Promise<WebSocketClient> {
  const socket = new WebSocketClient();
  await socket.initSocket();
  return socket;
}

class WebSocketClient {
  //Server
  private socket = new Client(process.env.REACT_APP_ADDR_NAME);
  //Save call functions
  private listeners: string[] = [];

  //Create socket
  async initSocket(): Promise<null> {
    return new Promise((resolve, reject) => {
      this.socket.on('open', () => {
        resolve(null);
      });
    });
  }

  //Get listener list
  getListeners(): string[] {
    return this.listeners;
  }

  //Call function on the server
  call<T>(method: string, data?: IWSRequestParams): Promise<T> {
    return this.socket.call(method, data) as Promise<T>;
  }

  //create listener to word
  listenTo<T>(event: string, callback: (response: T) => void): void {
    this.socket.on(event, (response: T) => {
      callback(response);
    });
    this.listeners.push(event);
  }
}

export default WebSocketClient;

import WebSocket, { Server } from 'ws';
import { generateJsonRpcNotification } from './json-rpc.utils';

export default function broadcast<T>(
  server: Server,
  event: string,
  includes: WebSocket[],
  params?: T,
): void {
  server.clients.forEach((client) => {
    if (includes.find((c) => c === client)) {
      const message = generateJsonRpcNotification(event, params);
      client.send(JSON.stringify(message));
    }
  });
}

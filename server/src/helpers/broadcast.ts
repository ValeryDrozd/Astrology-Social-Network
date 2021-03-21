import WebSocket, { Server } from 'ws';
import { generateJsonRpcNotification } from './json-rpc.utils';

export default function broadcast<T>(
  server: Server,
  event: string,
  options?: { except?: WebSocket[]; params?: T },
): void {
  server.clients.forEach((client) => {
    if (options?.except && !options.except.find((c) => c === client)) {
      const message = generateJsonRpcNotification(event, options.params);
      client.send(JSON.stringify(message));
    }
  });
}

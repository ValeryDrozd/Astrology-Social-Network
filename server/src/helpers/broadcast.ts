import WebSocket, { Server } from 'ws';
import { generateJsonRpcNotification } from './json-rpc.utils';

export default function broadcast(
  server: Server,
  event: string,
  options?: { except?: WebSocket[]; params?: unknown },
): void {
  server.clients.forEach((client) => {
    if (options?.except && !options.except.find((c) => c === client)) {
      const message = generateJsonRpcNotification(event, options.params);
      client.send(JSON.stringify(message));
    }
  });
}

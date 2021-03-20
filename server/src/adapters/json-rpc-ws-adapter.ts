import * as ws from 'ws';
import { INestApplicationContext } from '@nestjs/common';
import { AbstractWsAdapter, MessageMappingProperties } from '@nestjs/websockets';
import { Observable, fromEvent, EMPTY } from 'rxjs';
import { mergeMap, filter, map } from 'rxjs/operators';
import { IncomingMessage } from 'node:http';
import { JsonRpcRequest, JsonRpcResponse } from '../../../interfaces/json-rpc';
import { generateJsonRpcResponse } from 'src/helpers/json-rpc.utils';

export class JsonRpcWsAdapter extends AbstractWsAdapter {
  constructor(appOrHttpServer?: INestApplicationContext) {
    super(appOrHttpServer);
  }

  public create(port: number, options: Record<string, unknown>): ws.Server {
    return port === 0 && this.httpServer
      ? new ws.Server({ server: this.httpServer, ...options })
      : new ws.Server({ port, ...options });
  }

  public bindClientConnect(
    server: ws.Server,
    callback: (this: ws.Server, socket: ws, request: IncomingMessage) => void,
  ): void {
    server.on('connection', callback);
  }

  public bindMessageHandlers(
    client: WebSocket,
    handlers: MessageMappingProperties[],
    process: (data: unknown) => Observable<unknown>,
  ): void {
    fromEvent(client, 'message')
      .pipe(
        mergeMap((data) =>
          this.bindMessageHandler(data as MessageEvent, handlers, process),
        ),
        filter((result) => result !== undefined),
      )
      .subscribe((response) => client.send(JSON.stringify(response)));
  }

  public bindMessageHandler(
    buffer: MessageEvent,
    handlers: MessageMappingProperties[],
    process: (data: unknown) => Observable<unknown>,
  ): Observable<JsonRpcResponse> {
    const message: JsonRpcRequest = JSON.parse(buffer.data);

    const messageHandler = handlers.find((handler) => handler.message === message.method);

    if (!messageHandler) {
      return EMPTY;
    }
    const res = process(messageHandler.callback(message.params));

    return res.pipe(
      map<unknown, JsonRpcResponse>((value) =>
        generateJsonRpcResponse(value as Record<string, unknown>, message.id),
      ),
    );
  }

  public close(server: WebSocket): void {
    server.close();
  }
}

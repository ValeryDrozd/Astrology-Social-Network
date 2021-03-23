export interface JsonRpcRequest {
  jsonrpc: '2.0';
  method: string;
  params: Record<string, unknown>;
  id: number;
}

export interface JsonRpcResponse {
  result: Record<string, unknown>;
  id: number;
}

export interface JsonRpcNotification {
  notification: string;
  params: unknown;
}

export interface JsonRpcRequest {
  jsonrpc: "2.0";
  method: string;
  params: Record<string, unknown>;
  id: number;
}

export interface JsonRpcResponse {
  jsonrpc: "2.0";
  result: Record<string, unknown>;
  id: number;
}

export interface JsonRpcNotification {
  jsonrpc: "2.0",
  notification: string,
  params: unknown[]
}

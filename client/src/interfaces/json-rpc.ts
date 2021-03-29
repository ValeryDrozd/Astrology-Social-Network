interface JsonRpcAbstractRequest {
  jsonrpc: '2.0';
}
export interface JsonRpcRequest extends JsonRpcAbstractRequest {
  method: string;
  params: Record<string, unknown>;
  id: number;
}

export interface JsonRpcResponse extends JsonRpcAbstractRequest {
  result: Record<string, unknown>;
  id: number;
}

export type ErrorType = { code: number; message: string };

export interface JsonRpcError extends JsonRpcAbstractRequest {
  error: ErrorType;
  id: number;
}

export interface JsonRpcNotification extends JsonRpcAbstractRequest {
  notification: string;
  params: unknown;
}

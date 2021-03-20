import { JsonRpcNotification, JsonRpcResponse } from '../../../interfaces/json-rpc';

export const generateJsonRpcResponse = (
  value: Record<string, unknown>,
  id: number,
): JsonRpcResponse => ({
  jsonrpc: '2.0',
  result: value,
  id,
});

export const generateJsonRpcNotification = (
  notification: string,
  params?: unknown[] | undefined,
): JsonRpcNotification => ({
  jsonrpc: '2.0',
  notification,
  params: params || [],
});

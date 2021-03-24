import {
  JsonRpcNotification,
  JsonRpcResponse,
} from '../../../client/src/interfaces/json-rpc';

export const generateJsonRpcResponse = (
  value: Record<string, unknown>,
  id: number,
): JsonRpcResponse => ({
  result: value,
  id,
});

export const generateJsonRpcNotification = (
  notification: string,
  params?: unknown,
): JsonRpcNotification => ({
  notification,
  params,
});

import Chat from './chat';
import Message, { ServerMessage } from './message';

export const GetMessagesFunction = 'getMessages';
export type GetMessagesFunctionResponse = Chat[];

export const AddNewMessageFunction = 'addNewMessage';
export interface AddNewMessageParams {
  message: Message;
}

export const NewMessageNotification = 'newMessage';
export type NewMessageNotificationParams = ServerMessage;

export interface DeliveredEvent {
  ok: boolean;
  error?: string;
}

interface RpcError {
  errorDescription: string;
}

export const ConnectionStatusNotification = 'connection-status';
export interface ConnectionStatusNotificationPayload {
  ok: boolean;
  code?: number;
  message?: string;
}

import Chat from './chat';
import Message, { ServerMessage } from './message';
import { NewMessage } from './new-message';

export const GetMessagesFunction = 'getMessages';
export type GetMessagesFunctionResponse = Chat[];

export const AddNewMessageFunction = 'addNewMessage';
export interface AddNewMessageParams {
  message: Message;
}

export const NewMessageNotification = 'newMessage';
export type NewMessageNotificationParams = NewMessage;

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

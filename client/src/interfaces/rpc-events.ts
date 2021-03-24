import Chat from './chat';
import Message from './message';

export const GetMessagesFunction = 'getMessages';
export type GetMessagesFunctionResponse = Chat[];

export const AddNewMessageFunction = 'addNewMessage';
export interface AddNewMessageParams {
  message: Message;
}

export const NewMessageNotification = 'newMessage';
export type NewMessageNotificationParams = Message;

export interface DeliveredEvent {
  ok: true;
}

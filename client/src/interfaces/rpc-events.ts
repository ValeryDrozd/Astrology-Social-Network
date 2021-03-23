import Message from './message.entity';

export const GetMessagesFunction = 'getMessages';
export type GetMessagesFunctionResponse = Message[];

export const AddNewMessageFunction = 'addNewMessage';
export interface AddNewMessageParams {
  message: Message;
}

export const NewMessageNotification = 'newMessage';
export type NewMessageNotificationParams = Message;

export interface DeliveredEvent {
  ok: true;
}

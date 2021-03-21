import Message from "../interfaces/message.entity";

export const GetMessagesFunction: string = "getMessages";
export type GetMessagesFunctionResponse = Message[]

export const AddNewMessageFunction: string = "addNewMessage";
export interface AddNewMessageParams {
    message: Message;
}

export const NewMessageNotification: string = "newMessage";
export type NewMessageNotificationParams = Message

export interface DeliveredEvent {
    ok: true
}
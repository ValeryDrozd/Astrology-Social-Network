import Message, { ServerMessage } from './message';

export interface NewMessage extends ServerMessage {
  chatID: string;
}

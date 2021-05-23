import { Injectable } from '@nestjs/common';
import { ServerMessage } from '@interfaces/message';
import { NewMessage } from '@interfaces/new-message';
import { PgService } from '../pg/pg.service';
import getLastMessagesRequest from './get-last-messages';

@Injectable()
export class MessagesService {
  private tableName = 'Messages';
  constructor(private pgService: PgService) {}

  async getMessagesOfChat(
    chatID: string,
    limit?: number,
    lastMessageID?: string,
  ): Promise<ServerMessage[]> {
    const request = getLastMessagesRequest(limit ?? 20, !lastMessageID);
    return (
      await this.pgService.useQuery(
        request,
        !lastMessageID ? [chatID] : [chatID, lastMessageID],
      )
    ).rows;
  }

  async addNewMessage(message: NewMessage): Promise<void> {
    await this.pgService.create({
      tableName: this.tableName,
      values: [{ ...message, time: new Date(Date.now()).toISOString() }],
    });
  }
}

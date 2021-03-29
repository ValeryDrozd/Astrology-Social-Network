import { Injectable } from '@nestjs/common';
import { ServerMessage } from '@interfaces/message';
import { NewMessage } from '@interfaces/new-message';
import { PgService } from '../pg/pg.service';

@Injectable()
export class MessagesService {
  private tableName = 'Messages';
  constructor(private pgService: PgService) {}

  async getMessagesOfChat(chatID: string, limit?: number): Promise<ServerMessage[]> {
    return await this.pgService.find<ServerMessage>(
      { tableName: this.tableName, where: { chatID } },
      limit,
    );
  }

  async addNewMessage(message: NewMessage): Promise<void> {
    await this.pgService.create({
      tableName: this.tableName,
      values: [{ ...message, time: new Date(Date.now()).toISOString() }],
    });
  }
}

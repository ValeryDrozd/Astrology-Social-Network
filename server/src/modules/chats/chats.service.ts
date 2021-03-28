import { Injectable, NotFoundException } from '@nestjs/common';
import { chat } from 'googleapis/build/src/apis/chat';
import Chat from '../../../../client/src/interfaces/chat';
import { ServerMessage } from '../../../../client/src/interfaces/message';
import { MessagesService } from '../messages/messages.service';
import { PgService } from '../pg/pg.service';
import ChatDTO from './dto/chat.dto';
import requestQuery from './my-chats';

@Injectable()
export class ChatsService {
  constructor(private pgService: PgService, private messagesService: MessagesService) {}

  async findMyChatsWithMessages(userID: string): Promise<Chat[]> {
    const chats = (await this.pgService.useQuery(requestQuery, [userID]))
      .rows as ChatDTO[];

    const promises = chats.map((chat) =>
      this.messagesService.getMessagesOfChat(chat.chatID, 5),
    );
    const messages = await Promise.all(promises);
    return chats.map<Chat>(({ chatID, userID, firstName, lastName }, index) => ({
      chatID: chatID,
      messageList: messages[index].map((message) => ({ ...message, isSent: true })),
      senderInfo: {
        senderID: userID,
        firstName,
        lastName,
      },
    }));
  }
}

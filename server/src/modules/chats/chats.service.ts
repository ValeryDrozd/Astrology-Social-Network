import { Injectable, NotFoundException } from '@nestjs/common';
import Chat from '@interfaces/chat';
import { MessagesService } from '../messages/messages.service';
import { PgService } from '../pg/pg.service';
import ChatDTO from './dto/chat.dto';
import requestQuery from './my-chats';
import { v4 as uuid } from 'uuid';
import { UsersService } from '../users/users.service';

@Injectable()
export class ChatsService {
  private tableName = 'Chats';
  private chatUserTableName = 'ChatsUsers';
  constructor(
    private pgService: PgService,
    private messagesService: MessagesService,
    private usersService: UsersService,
  ) {}

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

  async findUsersOfChat(chatID: string): Promise<{ userID: string }[]> {
    return await this.pgService.find<{ userID: string }>({
      query: ['userID'],
      tableName: this.chatUserTableName,
      where: { chatID },
    });
  }

  async createNewChat(userID: string, memberID: string): Promise<Chat> {
    const chatID = uuid();
    await this.pgService.create<{ chatID: string }>({
      tableName: this.tableName,
      values: [{ chatID }],
    });

    type ChatUser = { id: string; chatID: string; userID: string };
    const chatsUsers = [userID, memberID].map<ChatUser>((currID) => ({
      id: uuid(),
      chatID,
      userID: currID,
    }));

    await this.pgService.create<ChatUser>({
      tableName: this.chatUserTableName,
      values: chatsUsers,
    });

    const { firstName, lastName } = await this.usersService.findById(memberID);
    return {
      chatID,
      messageList: [],
      senderInfo: {
        firstName,
        lastName,
        senderID: memberID,
      },
    };
  }
}

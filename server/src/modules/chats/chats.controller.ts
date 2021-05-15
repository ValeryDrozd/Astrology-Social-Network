import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtValidationOutput } from '../auth/strateries/jwt.strategy';
import { ChatsService } from './chats.service';
import {
  ChatRoute,
  CreateNewChatRoute,
  CreateNewChatRouteProps,
} from '@interfaces/routes/chat-routes';
import Chat from '@interfaces/chat';
@Controller(ChatRoute)
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(CreateNewChatRoute)
  async createNewChat(
    @Request() { user }: JwtValidationOutput,
    @Body() { memberID }: CreateNewChatRouteProps,
  ): Promise<Chat> {
    return await this.chatsService.createNewChat(user.userID, memberID);
  }
}

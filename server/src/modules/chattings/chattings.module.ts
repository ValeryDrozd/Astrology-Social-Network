import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ChatsService } from '../chats/chats.service';
import { MessagesService } from '../messages/messages.service';
import { ChattingsGateway } from './chattings.gateway';
import { ChattingsService } from './chattings.service';

@Module({
  imports: [AuthModule],
  providers: [ChattingsGateway, ChattingsService, ChatsService, MessagesService],
})
export class ChattingsModule {}

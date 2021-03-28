import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { ChatsService } from '../chats/chats.service';
import { MessagesService } from '../messages/messages.service';
import { ChatingsGateway } from './chatings.gateway';
import { ChatingsService } from './chatings.service';

@Module({
  imports: [AuthModule],
  providers: [ChatingsGateway, ChatingsService, ChatsService, MessagesService],
})
export class ChatingsModule {}

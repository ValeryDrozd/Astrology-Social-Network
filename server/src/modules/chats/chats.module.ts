import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MessagesService } from '../messages/messages.service';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';

@Module({
  imports: [AuthModule],
  controllers: [ChatsController],
  providers: [ChatsService, MessagesService],
})
export class ChatsModule {}

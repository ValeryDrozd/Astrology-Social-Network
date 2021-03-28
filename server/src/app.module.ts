import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ChatingsModule } from './modules/chatings/chatings.module';
import { AuthModule } from './modules/auth/auth.module';
import { ScryptService } from './modules/scrypt/scrypt.service';
import { RefreshSessionsModule } from './modules/refresh-sessions/refresh-sessions.module';
import { AuthProvidersModule } from './modules/auth-providers/auth-providers.module';
import { ChatsService } from './modules/chats/chats.service';
import { MessagesService } from './modules/messages/messages.service';

@Module({
  imports: [
    UsersModule,
    ChatingsModule,
    AuthModule,
    RefreshSessionsModule,
    AuthProvidersModule,
  ],
  controllers: [],
  providers: [ScryptService, ChatsService, MessagesService],
})
export class AppModule {}

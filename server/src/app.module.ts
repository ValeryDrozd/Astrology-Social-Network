import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ChattingsModule } from './modules/chattings/chattings.module';
import { AuthModule } from './modules/auth/auth.module';
import { ScryptService } from './modules/scrypt/scrypt.service';
import { RefreshSessionsModule } from './modules/refresh-sessions/refresh-sessions.module';
import { AuthProvidersModule } from './modules/auth-providers/auth-providers.module';
import { ChatsService } from './modules/chats/chats.service';
import { MessagesService } from './modules/messages/messages.service';
import { ZodiacSignsService } from './modules/zodiac-signs/zodiac-signs.service';
import { ChatsModule } from './modules/chats/chats.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', '..', 'client/build'),
    }),
    UsersModule,
    ChattingsModule,
    AuthModule,
    RefreshSessionsModule,
    AuthProvidersModule,
    ChatsModule,
  ],
  controllers: [],
  providers: [ScryptService, ChatsService, MessagesService, ZodiacSignsService],
})
export class AppModule {}

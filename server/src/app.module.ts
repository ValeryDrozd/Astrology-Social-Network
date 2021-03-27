import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { MessagesModule } from './modules/messages/messages.module';
import { AuthModule } from './modules/auth/auth.module';
import { ScryptService } from './modules/scrypt/scrypt.service';
import { RefreshSessionsModule } from './modules/refresh-sessions/refresh-sessions.module';
import { AuthProvidersModule } from './modules/auth-providers/auth-providers.module';

@Module({
  imports: [
    UsersModule,
    MessagesModule,
    AuthModule,
    RefreshSessionsModule,
    AuthProvidersModule,
  ],
  controllers: [],
  providers: [ScryptService],
})
export class AppModule {}

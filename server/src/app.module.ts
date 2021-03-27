import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { GoogleModule } from './modules/google/google.module';
import { GoogleStrategy } from './modules/google/google.strategy';
import { MessagesModule } from './modules/messages/messages.module';
import { AuthModule } from './modules/auth/auth.module';
import { ScryptService } from './modules/scrypt/scrypt.service';
import { RefreshSessionsModule } from './modules/refresh-sessions/refresh-sessions.module';
import { AuthProvidersModule } from './modules/auth-providers/auth-providers.module';

@Module({
  imports: [
    UsersModule,
    GoogleModule,
    MessagesModule,
    AuthModule,
    RefreshSessionsModule,
    AuthProvidersModule,
  ],
  controllers: [],
  providers: [GoogleStrategy, ScryptService],
})
export class AppModule {}

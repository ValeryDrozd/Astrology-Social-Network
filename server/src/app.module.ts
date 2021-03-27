import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { GoogleModule } from './modules/google/google.module';
import { GoogleStrategy } from './modules/google/google.strategy';
import { MessagesModule } from './modules/messages/messages.module';
import { AuthModule } from './modules/auth/auth.module';
import { AccessTokensService } from './modules/access-tokens/access-tokens.service';

@Module({
  imports: [UsersModule, GoogleModule, MessagesModule, AuthModule],
  // imports: [MessagesModule],
  controllers: [],
  providers: [GoogleStrategy, AccessTokensService],
})
export class AppModule {}

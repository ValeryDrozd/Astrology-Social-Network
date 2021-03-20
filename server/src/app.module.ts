import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { GoogleModule } from './modules/google/google.module';
import { GoogleStrategy } from './modules/google/google.strategy';
import { MessagesModule } from './modules/messages/messages.module';

@Module({
  imports: [UsersModule, GoogleModule, MessagesModule],
  controllers: [],
  providers: [GoogleStrategy],
})
export class AppModule {}

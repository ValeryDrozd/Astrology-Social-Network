import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { GoogleModule } from './modules/google/google.module';
import { GoogleStrategy } from './modules/google/google.strategy';

@Module({
  imports: [UsersModule, GoogleModule],
  controllers: [],
  providers: [GoogleStrategy],
})
export class AppModule {}

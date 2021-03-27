import { Injectable } from '@nestjs/common';
import { RegisterData } from '../auth/dto/register.dto';
import { PgService } from '../pg/pg.service';
import User from './dto/user.dto';

@Injectable()
export class UsersService {
  private tableName = 'Users';
  constructor(private pgService: PgService) {}

  async registerUser(registerData: RegisterData): Promise<void> {
    await this.pgService.create({ values: [registerData], tableName: this.tableName });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.pgService.findOne<User>({
      tableName: this.tableName,
      where: { email },
    });
  }
}

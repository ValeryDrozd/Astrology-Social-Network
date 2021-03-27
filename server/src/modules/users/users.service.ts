import { Injectable } from '@nestjs/common';
import RegisterDTO, { RegisterData } from '../auth/dto/register.dto';
import { PgService } from '../pg/pg.service';

@Injectable()
export class UsersService {
  private tableName = 'Users';
  constructor(private pgService: PgService) {}

  async registerUser(registerData: RegisterData): Promise<void> {
    await this.pgService.create({ values: [registerData], tableName: this.tableName });
  }
}

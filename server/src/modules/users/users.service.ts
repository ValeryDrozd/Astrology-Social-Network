import { Injectable } from '@nestjs/common';
import User, { UserUpdates } from '@interfaces/user';
import { RegisterData } from '../auth/dto/register.dto';
import { PgService } from '../pg/pg.service';
import UserEntity from './user.entity';
import { ZodiacSignsService } from '../zodiac-signs/zodiac-signs.service';

@Injectable()
export class UsersService {
  private tableName = 'Users';
  constructor(
    private pgService: PgService,
    private zodiacSignsService: ZodiacSignsService,
  ) {}

  async registerUser(registerData: RegisterData): Promise<void> {
    await this.pgService.create({ values: [registerData], tableName: this.tableName });
  }

  async findByEmail(email: string): Promise<User> {
    const {
      firstName,
      lastName,
      userID,
      birthDate,
      sex,
      zodiacID,
    } = await this.pgService.findOne<UserEntity>({
      tableName: this.tableName,
      where: { email },
    });

    const res = await this.zodiacSignsService.getZodiacName(zodiacID);
    return { userID, firstName, lastName, email, birthDate, sex, zodiacSign: res?.name };
  }

  async findById(userID: string): Promise<User> {
    const {
      firstName,
      lastName,
      email,
      birthDate,
      sex,
      zodiacID,
    } = await this.pgService.findOne<UserEntity>({
      tableName: this.tableName,
      where: { userID },
    });

    const res = await this.zodiacSignsService.getZodiacName(zodiacID);
    return { userID, firstName, lastName, email, birthDate, sex, zodiacSign: res?.name };
  }

  async patchUser(userID: string, updates: UserUpdates): Promise<void> {
    await this.pgService.update<UserUpdates>({
      tableName: this.tableName,
      updates: updates as Record<string, unknown>,
      where: { userID },
    });
  }
}

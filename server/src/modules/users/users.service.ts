import { Injectable, NotFoundException } from '@nestjs/common';
import User, { UserUpdates, UserWithCompability } from '@interfaces/user';
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

  async getRecommendations(
    userID: string,
    sex?: boolean,
  ): Promise<UserWithCompability[]> {
    const user = await this.findById(userID);
    return await this.zodiacSignsService.getMyRecommendations(user, sex);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.pgService.findOne<UserEntity>({
      tableName: this.tableName,
      where: { email },
    });
    if (!user) {
      return user;
    }
    const { firstName, lastName, userID, birthDate, sex, zodiacSign } = user;
    return { userID, firstName, lastName, email, birthDate, sex, zodiacSign };
  }

  async findById(userID: string): Promise<User> {
    const user = await this.pgService.findOne<UserEntity>({
      tableName: this.tableName,
      where: { userID },
    });
    if (!user) {
      return user;
    }

    const { firstName, lastName, email, birthDate, sex, zodiacSign } = user;
    return { userID, firstName, lastName, email, birthDate, sex, zodiacSign };
  }

  async patchUser(userID: string, updates: UserUpdates): Promise<void> {
    await this.pgService.update<Partial<UserEntity>>({
      tableName: this.tableName,
      updates: updates as Record<string, unknown>,
      where: { userID },
    });
  }
}

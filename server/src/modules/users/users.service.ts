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

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.pgService.findOne<UserEntity>({
      tableName: this.tableName,
      where: { email },
    });
    if (!user) return;
    const { firstName, lastName, userID, birthDate, sex, zodiacSignID: zodiacID } = user;

    const zodiacSign = await this.zodiacSignsService.getZodiacName(zodiacID);
    return { userID, firstName, lastName, email, birthDate, sex, zodiacSign };
  }

  async findById(userID: string): Promise<User> {
    const {
      firstName,
      lastName,
      email,
      birthDate,
      sex,
      zodiacSignID: zodiacID,
    } = await this.pgService.findOne<UserEntity>({
      tableName: this.tableName,
      where: { userID },
    });

    const zodiacSign = await this.zodiacSignsService.getZodiacName(zodiacID);
    return { userID, firstName, lastName, email, birthDate, sex, zodiacSign };
  }

  async patchUser(userID: string, updates: UserUpdates): Promise<void> {
    const newUpdates: Partial<UserEntity> & UserUpdates = { ...updates };
    if (updates?.zodiacSign) {
      const zodiacSignID = await this.zodiacSignsService.getZodiacSignID(
        updates?.zodiacSign as string,
      );
      newUpdates.zodiacSignID = zodiacSignID;
      delete newUpdates.zodiacSign;
    }

    await this.pgService.update<Partial<UserEntity>>({
      tableName: this.tableName,
      updates: newUpdates as Record<string, unknown>,
      where: { userID },
    });
  }
}

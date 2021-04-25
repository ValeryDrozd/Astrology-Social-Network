import { UserWithCompability } from '@interfaces/user';
import { Injectable } from '@nestjs/common';
import { PgService } from '../pg/pg.service';
import ZodiacSign from './zodiac-sign.entity';

@Injectable()
export class ZodiacSignsService {
  private tableName = 'ZodiacSigns';
  constructor(private pgService: PgService) {}

  async getZodiacName(zodiacID: number): Promise<string | undefined> {
    return (
      await this.pgService.findOne<ZodiacSign>({
        tableName: this.tableName,
        where: { zodiacID },
      })
    )?.name;
  }

  async getZodiacSignID(name: string): Promise<number | undefined> {
    return (
      await this.pgService.findOne<ZodiacSign>({
        tableName: this.tableName,
        where: { name },
      })
    )?.zodiacID;
  }

  async getMyRecommendations(
    userID: string,
    sex?: boolean,
  ): Promise<UserWithCompability[]> {
    const request =
      sex === undefined
        ? `SELECT * FROM "GetRecommendations" ($1)`
        : `SELECT * FROM "GetRecommendationsWithSex" ($1, $2)`;
    const varArray = sex === undefined ? [userID] : [userID, sex];
    return (await this.pgService.useQuery(request, varArray)).rows;
  }
}

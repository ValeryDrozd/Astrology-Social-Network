import User, { UserWithCompatibility } from '@interfaces/user';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PgService } from '../pg/pg.service';
import zodiacSigns from '@interfaces/zodiac-signs';
import zodiacSignsCompatibilities from './zodiac-signs-compatibilities';

@Injectable()
export class ZodiacSignsService {
  constructor(private pgService: PgService) {}

  async getMyRecommendations(
    user: User,
    sex?: boolean,
  ): Promise<UserWithCompatibility[]> {
    const signs = this.getRecommendedSigns(user);
    const request = `SELECT u."userID", u."firstName", u."lastName", u."email", u."birthDate", u."sex", u."zodiacSign" FROM "Users" u
        WHERE u."sex" ${sex === undefined ? 'IS NOT NULL' : ` = ${sex}`} AND (${signs
      .map((s, index) => `"zodiacSign" = $${index + 1}`)
      .join(' OR ')})
        AND NOT u."userID" = $${signs.length + 1}
        ORDER BY RANDOM() LIMIT 20`;
    return (await this.pgService.useQuery(request, [...signs, user.userID])).rows.map(
      (rec) => ({
        ...rec,
        compatibility:
          zodiacSignsCompatibilities[
            zodiacSigns.findIndex((zo) => zo === user.zodiacSign)
          ][zodiacSigns.findIndex((zo) => zo === rec.zodiacSign)],
      }),
    );
  }

  private getRecommendedSigns(user: User): string[] {
    const zodiacID = zodiacSigns.findIndex((z) => z === user.zodiacSign);
    if (zodiacID === -1) {
      throw new NotFoundException('No such zodiac sign!');
    }

    const minimumCompatibility = 50;
    return user?.sex
      ? zodiacSignsCompatibilities.reduce<string[]>(
          (prev, arr, index) =>
            arr[zodiacID] > minimumCompatibility ? [...prev, zodiacSigns[index]] : prev,
          [],
        )
      : zodiacSignsCompatibilities[zodiacID].reduce<string[]>(
          (prev, num, index) =>
            num > minimumCompatibility ? [...prev, zodiacSigns[index]] : prev,
          [],
        );
  }
}

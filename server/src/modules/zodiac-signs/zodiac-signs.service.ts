import { Injectable } from '@nestjs/common';
import { PgService } from '../pg/pg.service';
import ZodiacSign from './zodiac-sign.entity';

@Injectable()
export class ZodiacSignsService {
  private tableName = 'ZodiacSigns';
  constructor(private pgService: PgService) {}

  async getZodiacName(zodiacID: number): Promise<ZodiacSign> {
    return await this.pgService.findOne<ZodiacSign>({
      tableName: this.tableName,
      where: { zodiacID },
    });
  }
}

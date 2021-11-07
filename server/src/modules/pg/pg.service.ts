import { Injectable } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';
import {
  DeleteParams,
  InsertParams,
  SelectParams,
  UpdateParams,
} from './interfaces/query-params.interface';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

@Injectable()
export class PgService {
  private pool: Pool = new Pool();
  constructor() {
    if (process.env.NODE_ENV !== 'test') {
      this.pool = new Pool();
      fs.readFile('db/tables.sql', (err, data) => {
        if (err) return console.log(err);
        this.useQuery(data.toString());
      });
    }
  }
  async create<T>({
    tableName,
    values,
    returning,
  }: InsertParams<T>): Promise<QueryResult> {
    const columnNamesString = Object.keys(values[0])
      .map((key) => `"${key}"`)
      .join(',');

    let counter = 1;

    const requestValues = values.map((value) => Object.values(value)).flat(1);

    const request =
      'INSERT INTO "' +
      tableName +
      '" (' +
      columnNamesString +
      ') VALUES ' +
      values
        .map(
          (value) =>
            '(' +
            Object.values(value)
              .map(() => `$${counter++}`)
              .join(',') +
            ')',
        )
        .join(',') +
      (returning ? `RETURNING "${returning}"` : '');
    try {
      return await this.pool.query(request, requestValues);
    } catch (error) {
      return error as QueryResult;
    }
  }

  async find<T>(
    { query, tableName, where, orderBy }: SelectParams,
    limit?: number,
  ): Promise<T[]> {
    let counter = 1;
    const whereStatements =
      (where
        ? 'WHERE ' +
          Object.keys(where)
            .map((key) => `"${key}"=$${counter++}`)
            .join(' AND ')
        : '') + ' ';

    const orderByStatement = orderBy ? `ORDER BY ${orderBy.map(() => counter++)} ` : ' ';
    const request =
      'SELECT ' +
      (query ? query.map((column) => `"${column}"`).join(',') : '*') +
      ` FROM "${tableName}" ` +
      whereStatements +
      orderByStatement +
      (limit ? `LIMIT ${limit} ` : '');
    const values = [...(where ? Object.values(where) : []), ...(orderBy ?? [])];
    try {
      const res = await this.pool.query(request, values);
      return res.rows as T[];
    } catch (error) {
      return error as T[];
    }
  }

  async findOne<T>(params: SelectParams): Promise<T> {
    const res = await this.find<T>(params, 1);
    return res[0];
  }

  async delete({
    tableName,
    where,
    returning,
    cascade,
  }: DeleteParams): Promise<QueryResult | undefined> {
    const request =
      `DELETE FROM "${tableName}" ` +
      (cascade ? 'CASCADE ' : '') +
      `WHERE ` +
      Object.keys(where)
        .map((key, index) => `"${key}"=$${index + 1}`)
        .join(' AND ') +
      (returning ? `RETURNING "${returning}"` : '');
    try {
      return this.pool.query(request, Object.values(where));
    } catch (error) {
      console.log(error);
    }
  }

  async update<T>({
    tableName,
    updates,
    where,
    returning,
  }: UpdateParams<T>): Promise<QueryResult> {
    let counter = 1;
    const sets = Object.keys(updates)
      .filter((key) => updates[key] !== undefined)
      .map((key) => `"${key}"=$${counter++}`)
      .join(',');

    const whereStatements = Object.keys(where)
      .map((key) => `"${key}"=$${counter++}`)
      .join(' AND ');

    const request =
      `UPDATE "${tableName}" SET ${sets} WHERE ${whereStatements}` +
      (returning ? `Returning "${returning}"` : '');

    try {
      return this.pool.query(request, [
        ...Object.values(updates),
        ...Object.values(where),
      ]);
    } catch (error) {
      return error as QueryResult;
    }
  }

  useQuery(request: string, values?: unknown[]): Promise<QueryResult> {
    return this.pool.query(request, values);
  }
}

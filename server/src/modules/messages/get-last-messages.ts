export default function getLastMessagesRequest(limit: number, firstLoad = true): string {
  return `SELECT * FROM "Messages"
          WHERE "chatID" = $1
          ${
            firstLoad
              ? ''
              : `AND "time" < (SELECT "time" FROM "Messages" WHERE "messageID" = $2)`
          }
          ORDER BY "time" DESC LIMIT ${limit}`;
}

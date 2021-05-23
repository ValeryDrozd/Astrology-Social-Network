export default `WITH chats AS (SELECT c."chatID" FROM "Chats" c 
JOIN "ChatsUsers" cu ON c."chatID" = cu."chatID"
WHERE cu."userID" = $1)

SELECT c."chatID", u."lastName", u."firstName", u."userID", COUNT("Messages"."messageID") AS "numberOfMessages" FROM chats c
JOIN "ChatsUsers" cu ON c."chatID" = cu."chatID"
JOIN "Users" u ON cu."userID" = u."userID"
JOIN "Messages" ON "Messages"."chatID" = c."chatID"
WHERE NOT cu."userID" = $1
GROUP BY c."chatID", u."lastName", u."firstName", u."userID"`;

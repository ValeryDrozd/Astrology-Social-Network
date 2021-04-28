CREATE TABLE "Users"(
	"userID" UUID PRIMARY KEY,
	"firstName" VARCHAR(255),
	"lastName" VARCHAR(255),
	"email" VARCHAR(255) NOT NULL,
	"birthDate" DATE,
	"zodiacSign" VARCHAR,
	"about" TEXT,
	"sex" BOOLEAN -- f - false, m - true
);

CREATE TABLE "AuthProviders"(
	"authID" SERIAL PRIMARY KEY,
	"userID" UUID REFERENCES "Users" ON DELETE CASCADE,
	"authName" VARCHAR (100) NOT NULL,
	"password" TEXT
);


CREATE TABLE "RefreshSessions" (
    "id" SERIAL PRIMARY KEY,
    "userID" UUID REFERENCES "Users" ON DELETE CASCADE,
    "refreshToken" UUID NOT NULL,
    "userAgent" VARCHAR(200) NOT NULL,
    "fingerprint" VARCHAR(200) NOT NULL,
    "expiresIn" BIGINT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);


CREATE TABLE "Chats" (
	"chatID" UUID PRIMARY KEY
);

CREATE TABLE "ChatsUsers" (
	"id" UUID PRIMARY KEY,
	"chatID" UUID REFERENCES "Chats" ON DELETE CASCADE,
	"userID" UUID REFERENCES "Users" ON DELETE CASCADE
);

CREATE TABLE "Messages" (
	"messageID" UUID PRIMARY KEY,
	"chatID" UUID REFERENCES "Chats" ON DELETE CASCADE,
	"senderID" UUID REFERENCES "Users" ON DELETE CASCADE,
	"text" TEXT,
	"time" TIMESTAMP WITH TIME ZONE
);
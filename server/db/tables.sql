CREATE TABLE "ZodiacSigns" (
	"zodiacID" SERIAL PRIMARY KEY,
	"name" VARCHAR(255)
);

CREATE TABLE "ZodiacCompatibility" (
	"zodiacID1" INT REFERENCES "ZodiacSigns" ON DELETE CASCADE,
	"zodiacID2" INT REFERENCES "ZodiacSigns" ON DELETE CASCADE,
	"compatibility" INT,
	PRIMARY KEY ("zodiacID1", "zodiacID2")
);

CREATE TABLE "Users"(
	"userID" UUID PRIMARY KEY,
	"firstName" VARCHAR(255),
	"lastName" VARCHAR(255),
	"email" VARCHAR(255) NOT NULL,
	"birthDate" DATE,
	"zodiacSignID" INT REFERENCES "ZodiacSigns",
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
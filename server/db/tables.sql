CREATE TABLE "ZodiacSigns" (
	"zodiacID" SERIAL PRIMARY KEY,
	"name" VARCHAR(255),
	"sex" VARCHAR(1) CHECK ("sex" IN ('F','M'))
);

CREATE TABLE "ZodiacCompatibility" (
	"zodiacID1" INT REFERENCES "ZodiacSigns",
	"zodiacID2" INT REFERENCES "ZodiacSigns",
	"compatibility" REAL,
	PRIMARY KEY ("zodiacID1", "zodiacID2")
);

CREATE TABLE "Users"(
	"userID" UUID PRIMARY KEY,
	"firstName" VARCHAR(255),
	"lastName" VARCHAR(255),
	"email" VARCHAR(255) NOT NULL,
	"birthDate" DATE,
	"zodiacSignID" INT REFERENCES "ZodiacSigns"
);

CREATE TABLE "AuthProviders"(
	"authID" SERIAL PRIMARY KEY,
	"userID" UUID REFERENCES "Users" ON DELETE CASCADE,
	"authName" VARCHAR (100) NOT NULL,
	"password" VARCHAR (255)
);


CREATE TABLE "RefreshSessions" (
    "id" SERIAL PRIMARY KEY,
    "userID" UUID REFERENCES "Users" ON DELETE CASCADE,
    "refreshToken" UUID NOT NULL,
    "userAgent" VARCHAR(200) NOT NULL,
    "fingerprint" VARCHAR(200) NOT NULL,
    "ip" VARCHAR(15) NOT NULL,
    "expiresIn" BIGINT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

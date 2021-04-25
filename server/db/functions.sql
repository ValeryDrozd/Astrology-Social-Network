CREATE OR REPLACE FUNCTION "GetCompatibilities" ("zodiacName" VARCHAR)
RETURNS TABLE ("zodiacID" INT, "compatibility" INT)
AS $$
DECLARE
  currZodiacID INT;
BEGIN
	SELECT "ZodiacSigns"."zodiacID" INTO currZodiacID FROM "ZodiacSigns" WHERE "ZodiacSigns"."name" = $1;
	RETURN QUERY (
		SELECT "ZodiacCompatibility"."zodiacID2", "ZodiacCompatibility"."compatibility" FROM "ZodiacCompatibility"
		WHERE "zodiacID1" = currZodiacID
		UNION 
		SELECT "ZodiacCompatibility"."zodiacID1", "ZodiacCompatibility"."compatibility" FROM "ZodiacCompatibility"
		WHERE "zodiacID2" = currZodiacID
	);
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION "GetRecommendationsWithSex" ("user" UUID, "targetSex" BOOLEAN)
RETURNS TABLE (
	"userID"     UUID, 
	"firstName"  VARCHAR(255), 
	"lastName"   VARCHAR (255), 
	"email"      VARCHAR (255), 
	"birthDate"  DATE, 
    "sex"        BOOLEAN,
	"zodiacSign" VARCHAR (255), 
	"compability" INT
)
AS $$
DECLARE "zodiacName" VARCHAR;
BEGIN
   SELECT "name" INTO "zodiacName" FROM "ZodiacSigns" 
	WHERE "zodiacID" = (
		SELECT "zodiacSignID" FROM "Users" 
		WHERE "Users"."userID" = $1
	);
	RETURN QUERY (
		WITH "Compatibilities" AS (
			SELECT * FROM "GetCompatibilities" ("zodiacName")
		)
		SELECT u."userID", u."firstName", u."lastName", u."email", u."birthDate", u."sex", zs."name" AS "zodiacSign", zc."compatibility" FROM "Users" u
		JOIN "Compatibilities" zc ON zc."zodiacID" = u."zodiacSignID"
		JOIN "ZodiacSigns" zs ON zs."zodiacID" = zc."zodiacID"
        WHERE zc."compatibility" > 50 AND NOT u."userID" = $1 AND u."sex" = $2
		ORDER BY RANDOM() LIMIT 20
	);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION "GetRecommendations" ("user" UUID)
RETURNS TABLE (
	"userID"     UUID, 
	"firstName"  VARCHAR(255), 
	"lastName"   VARCHAR (255), 
	"email"      VARCHAR (255), 
	"birthDate"  DATE, 
    "sex"        BOOLEAN,
	"zodiacSign" VARCHAR (255), 
	"compability" INT
)
AS $$
	WITH "Recommendations" AS (
		SELECT * FROM "GetRecommendationsWithSex"($1, FALSE)
		UNION ALL
		SELECT * FROM "GetRecommendationsWithSex"($1, TRUE)
	)
	SELECT * FROM "Recommendations"
	ORDER BY RANDOM() LIMIT 20
$$ LANGUAGE SQL;
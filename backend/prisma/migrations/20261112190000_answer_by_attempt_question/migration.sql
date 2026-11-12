ALTER TABLE "attemptAnswer" ADD COLUMN "attemptQuestionId" UUID;

UPDATE "attemptAnswer" AS answer
SET "attemptQuestionId" = served."id"
FROM "attemptQuestion" AS served
WHERE served."assessmentAttemptId" = answer."assessmentAttemptId"
  AND served."questionId" = answer."questionId";

DELETE FROM "attemptAnswer" WHERE "attemptQuestionId" IS NULL;

ALTER TABLE "attemptAnswer" ALTER COLUMN "attemptQuestionId" SET NOT NULL;

DROP INDEX "attemptAnswer_assessmentAttemptId_questionId_key";

DROP INDEX "attemptQuestion_assessmentAttemptId_questionId_key";

CREATE INDEX "attemptAnswer_assessmentAttemptId_idx" ON "attemptAnswer"("assessmentAttemptId");

CREATE UNIQUE INDEX "attemptAnswer_attemptQuestionId_key" ON "attemptAnswer"("attemptQuestionId");

ALTER TABLE "attemptAnswer" ADD CONSTRAINT "attemptAnswer_attemptQuestionId_fkey" FOREIGN KEY ("attemptQuestionId") REFERENCES "attemptQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropIndex
DROP INDEX "attemptAnswer_assessmentAttemptId_idx";

-- CreateTable
CREATE TABLE "attemptQuestion" (
    "id" UUID NOT NULL,
    "assessmentAttemptId" UUID NOT NULL,
    "questionId" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "seed" INTEGER,
    "generatedQuestion" JSONB,
    "difficulty" INTEGER NOT NULL,
    "hintsUsed" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "attemptQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "attemptQuestion_questionId_idx" ON "attemptQuestion"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "attemptQuestion_assessmentAttemptId_position_key" ON "attemptQuestion"("assessmentAttemptId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "attemptQuestion_assessmentAttemptId_questionId_key" ON "attemptQuestion"("assessmentAttemptId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "attemptAnswer_assessmentAttemptId_questionId_key" ON "attemptAnswer"("assessmentAttemptId", "questionId");

-- AddForeignKey
ALTER TABLE "attemptQuestion" ADD CONSTRAINT "attemptQuestion_assessmentAttemptId_fkey" FOREIGN KEY ("assessmentAttemptId") REFERENCES "assessmentAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attemptQuestion" ADD CONSTRAINT "attemptQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "attemptQuestion" ADD CONSTRAINT "attemptQuestion_difficulty_check" CHECK ("difficulty" BETWEEN 1 AND 5);
ALTER TABLE "attemptQuestion" ADD CONSTRAINT "attemptQuestion_hintsUsed_check" CHECK ("hintsUsed" >= 0);
ALTER TABLE "attemptQuestion" ADD CONSTRAINT "attemptQuestion_position_check" CHECK ("position" >= 1);

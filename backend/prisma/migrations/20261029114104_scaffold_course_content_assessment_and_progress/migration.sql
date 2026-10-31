-- CreateEnum
CREATE TYPE "questionType" AS ENUM ('multiple_choice', 'build_tree', 'order_nodes', 'predict_rotation', 'text');

-- CreateEnum
CREATE TYPE "bloomsLevel" AS ENUM ('remember', 'understand', 'apply', 'analyse', 'evaluate', 'create');

-- CreateEnum
CREATE TYPE "attemptKind" AS ENUM ('lesson_test', 'checkpoint', 'daily_challenge', 'practice');

-- CreateEnum
CREATE TYPE "lessonKind" AS ENUM ('lesson', 'checkpoint');

-- CreateEnum
CREATE TYPE "contentBlockType" AS ENUM ('text', 'diagram', 'animation', 'playground', 'code_trace');

-- CreateEnum
CREATE TYPE "progressStatus" AS ENUM ('locked', 'started', 'completed');

-- CreateTable
CREATE TABLE "answerOption" (
    "id" UUID NOT NULL,
    "questionId" UUID NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,

    CONSTRAINT "answerOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessmentAttempt" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" UUID,
    "dailyChallengeId" UUID,
    "kind" "attemptKind" NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "passed" BOOLEAN NOT NULL DEFAULT false,
    "points" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMPTZ(3),

    CONSTRAINT "assessmentAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attemptAnswer" (
    "id" UUID NOT NULL,
    "assessmentAttemptId" UUID NOT NULL,
    "questionId" UUID NOT NULL,
    "answerOptionId" UUID,
    "seed" INTEGER,
    "generatedQuestion" JSONB,
    "response" JSONB NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "hintsUsed" INTEGER NOT NULL DEFAULT 0,
    "ratingBefore" INTEGER NOT NULL,
    "ratingAfter" INTEGER NOT NULL,

    CONSTRAINT "attemptAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dailyChallenge" (
    "id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "questionId" UUID NOT NULL,
    "seed" INTEGER NOT NULL,

    CONSTRAINT "dailyChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hint" (
    "id" UUID NOT NULL,
    "questionId" UUID NOT NULL,
    "text" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "hint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question" (
    "id" UUID NOT NULL,
    "lessonId" UUID NOT NULL,
    "reviewLessonId" UUID NOT NULL,
    "type" "questionType" NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "bloomsLevel" "bloomsLevel" NOT NULL,
    "prompt" TEXT,
    "generatorKey" TEXT,
    "generatorOptions" JSONB,
    "explanation" TEXT NOT NULL,

    CONSTRAINT "question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "algorithm" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "algorithm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caseStudy" (
    "id" UUID NOT NULL,
    "lessonId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "scenario" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "task" JSONB NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "caseStudy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "codeLine" (
    "codeSnippetId" UUID NOT NULL,
    "stepKey" TEXT NOT NULL,
    "lineNumber" INTEGER NOT NULL,

    CONSTRAINT "codeLine_pkey" PRIMARY KEY ("codeSnippetId","stepKey")
);

-- CreateTable
CREATE TABLE "codeSnippet" (
    "id" UUID NOT NULL,
    "algorithmId" UUID NOT NULL,
    "codeLanguageId" UUID NOT NULL,
    "source" TEXT NOT NULL,

    CONSTRAINT "codeSnippet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contentBlock" (
    "id" UUID NOT NULL,
    "lessonId" UUID NOT NULL,
    "learningStyleId" UUID,
    "type" "contentBlockType" NOT NULL,
    "body" JSONB NOT NULL,
    "transcript" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "contentBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson" (
    "id" UUID NOT NULL,
    "unitId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "kind" "lessonKind" NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dailyActivity" (
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "dailyActivity_pkey" PRIMARY KEY ("userId","date")
);

-- CreateTable
CREATE TABLE "lessonProgress" (
    "userId" TEXT NOT NULL,
    "lessonId" UUID NOT NULL,
    "status" "progressStatus" NOT NULL DEFAULT 'started',
    "completedAt" TIMESTAMPTZ(3),

    CONSTRAINT "lessonProgress_pkey" PRIMARY KEY ("userId","lessonId")
);

-- CreateTable
CREATE TABLE "userMastery" (
    "userId" TEXT NOT NULL,
    "lessonId" UUID NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 1000,
    "mastery" DECIMAL(5,4) NOT NULL DEFAULT 0,
    "currentDifficulty" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "userMastery_pkey" PRIMARY KEY ("userId","lessonId")
);

-- CreateIndex
CREATE INDEX "answerOption_questionId_idx" ON "answerOption"("questionId");

-- CreateIndex
CREATE INDEX "assessmentAttempt_userId_idx" ON "assessmentAttempt"("userId");

-- CreateIndex
CREATE INDEX "assessmentAttempt_lessonId_idx" ON "assessmentAttempt"("lessonId");

-- CreateIndex
CREATE INDEX "assessmentAttempt_dailyChallengeId_idx" ON "assessmentAttempt"("dailyChallengeId");

-- CreateIndex
CREATE INDEX "attemptAnswer_assessmentAttemptId_idx" ON "attemptAnswer"("assessmentAttemptId");

-- CreateIndex
CREATE INDEX "attemptAnswer_questionId_idx" ON "attemptAnswer"("questionId");

-- CreateIndex
CREATE INDEX "attemptAnswer_answerOptionId_idx" ON "attemptAnswer"("answerOptionId");

-- CreateIndex
CREATE UNIQUE INDEX "dailyChallenge_date_key" ON "dailyChallenge"("date");

-- CreateIndex
CREATE INDEX "dailyChallenge_questionId_idx" ON "dailyChallenge"("questionId");

-- CreateIndex
CREATE INDEX "hint_questionId_idx" ON "hint"("questionId");

-- CreateIndex
CREATE INDEX "question_lessonId_idx" ON "question"("lessonId");

-- CreateIndex
CREATE INDEX "question_reviewLessonId_idx" ON "question"("reviewLessonId");

-- CreateIndex
CREATE UNIQUE INDEX "algorithm_code_key" ON "algorithm"("code");

-- CreateIndex
CREATE INDEX "caseStudy_lessonId_idx" ON "caseStudy"("lessonId");

-- CreateIndex
CREATE INDEX "codeSnippet_codeLanguageId_idx" ON "codeSnippet"("codeLanguageId");

-- CreateIndex
CREATE UNIQUE INDEX "codeSnippet_algorithmId_codeLanguageId_key" ON "codeSnippet"("algorithmId", "codeLanguageId");

-- CreateIndex
CREATE INDEX "contentBlock_lessonId_idx" ON "contentBlock"("lessonId");

-- CreateIndex
CREATE INDEX "contentBlock_learningStyleId_idx" ON "contentBlock"("learningStyleId");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_unitId_position_key" ON "lesson"("unitId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "unit_position_key" ON "unit"("position");

-- CreateIndex
CREATE INDEX "lessonProgress_lessonId_idx" ON "lessonProgress"("lessonId");

-- CreateIndex
CREATE INDEX "userMastery_lessonId_idx" ON "userMastery"("lessonId");

-- AddForeignKey
ALTER TABLE "answerOption" ADD CONSTRAINT "answerOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessmentAttempt" ADD CONSTRAINT "assessmentAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessmentAttempt" ADD CONSTRAINT "assessmentAttempt_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessmentAttempt" ADD CONSTRAINT "assessmentAttempt_dailyChallengeId_fkey" FOREIGN KEY ("dailyChallengeId") REFERENCES "dailyChallenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attemptAnswer" ADD CONSTRAINT "attemptAnswer_assessmentAttemptId_fkey" FOREIGN KEY ("assessmentAttemptId") REFERENCES "assessmentAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attemptAnswer" ADD CONSTRAINT "attemptAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attemptAnswer" ADD CONSTRAINT "attemptAnswer_answerOptionId_fkey" FOREIGN KEY ("answerOptionId") REFERENCES "answerOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dailyChallenge" ADD CONSTRAINT "dailyChallenge_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hint" ADD CONSTRAINT "hint_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_reviewLessonId_fkey" FOREIGN KEY ("reviewLessonId") REFERENCES "lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caseStudy" ADD CONSTRAINT "caseStudy_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "codeLine" ADD CONSTRAINT "codeLine_codeSnippetId_fkey" FOREIGN KEY ("codeSnippetId") REFERENCES "codeSnippet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "codeSnippet" ADD CONSTRAINT "codeSnippet_algorithmId_fkey" FOREIGN KEY ("algorithmId") REFERENCES "algorithm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "codeSnippet" ADD CONSTRAINT "codeSnippet_codeLanguageId_fkey" FOREIGN KEY ("codeLanguageId") REFERENCES "codeLanguage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contentBlock" ADD CONSTRAINT "contentBlock_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contentBlock" ADD CONSTRAINT "contentBlock_learningStyleId_fkey" FOREIGN KEY ("learningStyleId") REFERENCES "learningStyle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dailyActivity" ADD CONSTRAINT "dailyActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessonProgress" ADD CONSTRAINT "lessonProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessonProgress" ADD CONSTRAINT "lessonProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userMastery" ADD CONSTRAINT "userMastery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userMastery" ADD CONSTRAINT "userMastery_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CheckConstraint
ALTER TABLE "question" ADD CONSTRAINT "question_difficulty_check" CHECK ("difficulty" BETWEEN 1 AND 5);
ALTER TABLE "attemptAnswer" ADD CONSTRAINT "attemptAnswer_difficulty_check" CHECK ("difficulty" BETWEEN 1 AND 5);
ALTER TABLE "attemptAnswer" ADD CONSTRAINT "attemptAnswer_hintsUsed_check" CHECK ("hintsUsed" >= 0);
ALTER TABLE "assessmentAttempt" ADD CONSTRAINT "assessmentAttempt_kind_check" CHECK (
  ("kind" IN ('lesson_test', 'checkpoint') AND "lessonId" IS NOT NULL AND "dailyChallengeId" IS NULL)
  OR ("kind" = 'daily_challenge' AND "dailyChallengeId" IS NOT NULL AND "lessonId" IS NULL)
  OR ("kind" = 'practice' AND "lessonId" IS NULL AND "dailyChallengeId" IS NULL)
);

ALTER TABLE "userMastery" ADD CONSTRAINT "userMastery_mastery_check" CHECK ("mastery" BETWEEN 0 AND 1);
ALTER TABLE "userMastery" ADD CONSTRAINT "userMastery_currentDifficulty_check" CHECK ("currentDifficulty" BETWEEN 1 AND 5);
ALTER TABLE "dailyActivity" ADD CONSTRAINT "dailyActivity_count_check" CHECK ("count" >= 0);
ALTER TABLE "codeLine" ADD CONSTRAINT "codeLine_lineNumber_check" CHECK ("lineNumber" >= 1);

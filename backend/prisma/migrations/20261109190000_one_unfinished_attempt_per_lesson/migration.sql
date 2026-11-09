CREATE UNIQUE INDEX "assessmentAttempt_one_unfinished_test_per_lesson_key" ON "assessmentAttempt"("userId", "lessonId") WHERE "finishedAt" IS NULL AND "kind" IN ('lesson_test', 'checkpoint');

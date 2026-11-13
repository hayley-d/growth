-- CreateIndex
CREATE UNIQUE INDEX "assessmentAttempt_userId_dailyChallengeId_key" ON "assessmentAttempt"("userId", "dailyChallengeId");

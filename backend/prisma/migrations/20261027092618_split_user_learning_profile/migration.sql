-- CreateTable
CREATE TABLE "user_profile" (
    "userId" TEXT NOT NULL,
    "learningStyleId" UUID NOT NULL,
    "codeLanguageId" UUID NOT NULL,

    CONSTRAINT "user_profile_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE INDEX "user_profile_learningStyleId_idx" ON "user_profile"("learningStyleId");

-- CreateIndex
CREATE INDEX "user_profile_codeLanguageId_idx" ON "user_profile"("codeLanguageId");

-- AddForeignKey
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_learningStyleId_fkey" FOREIGN KEY ("learningStyleId") REFERENCES "learning_style"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_codeLanguageId_fkey" FOREIGN KEY ("codeLanguageId") REFERENCES "code_language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "lesson" ADD COLUMN     "notePrompt" TEXT;

-- CreateTable
CREATE TABLE "lessonNote" (
    "userId" TEXT NOT NULL,
    "lessonId" UUID NOT NULL,
    "body" TEXT NOT NULL,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "lessonNote_pkey" PRIMARY KEY ("userId","lessonId")
);

-- CreateIndex
CREATE INDEX "lessonNote_lessonId_idx" ON "lessonNote"("lessonId");

-- AddForeignKey
ALTER TABLE "lessonNote" ADD CONSTRAINT "lessonNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessonNote" ADD CONSTRAINT "lessonNote_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "lessonNote" ADD CONSTRAINT "lessonNote_body_check" CHECK (char_length("body") <= 2000);

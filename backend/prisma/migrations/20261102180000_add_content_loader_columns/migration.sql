-- AlterTable
ALTER TABLE "lesson" ADD COLUMN     "isRetired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "objectives" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "question" ADD COLUMN     "answer" JSONB,
ADD COLUMN     "isRetired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tree" TEXT;


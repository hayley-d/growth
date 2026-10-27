/*
  Warnings:

  - You are about to drop the column `colourTheme` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `displayName` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `showOnLeaderboard` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `textToSpeech` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `codeLanguageId` on the `user_profile` table. All the data in the column will be lost.
  - You are about to drop the column `learningStyleId` on the `user_profile` table. All the data in the column will be lost.
  - Added the required column `code_language_id` to the `user_profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `display_name` to the `user_profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `user_profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `user_profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `learning_style_id` to the `user_profile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "colour_theme" AS ENUM ('default', 'high-contrast', 'okabe-ito');

-- DropForeignKey
ALTER TABLE "user_profile" DROP CONSTRAINT "user_profile_codeLanguageId_fkey";

-- DropForeignKey
ALTER TABLE "user_profile" DROP CONSTRAINT "user_profile_learningStyleId_fkey";

-- DropIndex
DROP INDEX "user_profile_codeLanguageId_idx";

-- DropIndex
DROP INDEX "user_profile_learningStyleId_idx";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "colourTheme",
DROP COLUMN "displayName",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "showOnLeaderboard",
DROP COLUMN "textToSpeech";

-- AlterTable
ALTER TABLE "user_profile" DROP COLUMN "codeLanguageId",
DROP COLUMN "learningStyleId",
ADD COLUMN     "code_language_id" UUID NOT NULL,
ADD COLUMN     "colour_theme" "colour_theme" NOT NULL DEFAULT 'default',
ADD COLUMN     "display_name" TEXT NOT NULL,
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "learning_style_id" UUID NOT NULL,
ADD COLUMN     "show_on_leaderboard" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "text_to_speech" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "user_profile_learning_style_id_idx" ON "user_profile"("learning_style_id");

-- CreateIndex
CREATE INDEX "user_profile_code_language_id_idx" ON "user_profile"("code_language_id");

-- AddForeignKey
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_learning_style_id_fkey" FOREIGN KEY ("learning_style_id") REFERENCES "learning_style"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_code_language_id_fkey" FOREIGN KEY ("code_language_id") REFERENCES "code_language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

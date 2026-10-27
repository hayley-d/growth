/*
  Warnings:

  - You are about to drop the column `display_name` on the `user_profile` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `user_profile` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `user_profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_profile" DROP COLUMN "display_name",
DROP COLUMN "first_name",
DROP COLUMN "last_name";

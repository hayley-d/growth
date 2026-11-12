-- CreateEnum
CREATE TYPE "treeMode" AS ENUM ('bst', 'avl');

-- AlterTable
ALTER TABLE "unit" ADD COLUMN "treeMode" "treeMode" NOT NULL DEFAULT 'avl';

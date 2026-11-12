CREATE TYPE "practiceTopic" AS ENUM ('traversals', 'insertion', 'deletion', 'rotations', 'mixed');

ALTER TABLE "assessmentAttempt" ADD COLUMN "practiceTopic" "practiceTopic";

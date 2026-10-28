-- AlterColumnType
ALTER TABLE "user"
  ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ(3) USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ(3) USING "updatedAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "banExpires" TYPE TIMESTAMPTZ(3) USING "banExpires" AT TIME ZONE 'UTC';

ALTER TABLE "session"
  ALTER COLUMN "expiresAt" TYPE TIMESTAMPTZ(3) USING "expiresAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ(3) USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ(3) USING "updatedAt" AT TIME ZONE 'UTC';

ALTER TABLE "account"
  ALTER COLUMN "accessTokenExpiresAt" TYPE TIMESTAMPTZ(3) USING "accessTokenExpiresAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "refreshTokenExpiresAt" TYPE TIMESTAMPTZ(3) USING "refreshTokenExpiresAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ(3) USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ(3) USING "updatedAt" AT TIME ZONE 'UTC';

ALTER TABLE "verification"
  ALTER COLUMN "expiresAt" TYPE TIMESTAMPTZ(3) USING "expiresAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "createdAt" TYPE TIMESTAMPTZ(3) USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE TIMESTAMPTZ(3) USING "updatedAt" AT TIME ZONE 'UTC';

-- RenameEnum
ALTER TYPE "colour_theme" RENAME TO "colourTheme";

-- RenameTable
ALTER TABLE "learning_style" RENAME TO "learningStyle";
ALTER TABLE "code_language" RENAME TO "codeLanguage";
ALTER TABLE "user_profile" RENAME TO "userProfile";

-- RenameColumn
ALTER TABLE "userProfile" RENAME COLUMN "text_to_speech" TO "textToSpeech";
ALTER TABLE "userProfile" RENAME COLUMN "colour_theme" TO "colourTheme";
ALTER TABLE "userProfile" RENAME COLUMN "show_on_leaderboard" TO "showOnLeaderboard";
ALTER TABLE "userProfile" RENAME COLUMN "learning_style_id" TO "learningStyleId";
ALTER TABLE "userProfile" RENAME COLUMN "code_language_id" TO "codeLanguageId";

-- RenamePrimaryKey
ALTER TABLE "learningStyle" RENAME CONSTRAINT "learning_style_pkey" TO "learningStyle_pkey";
ALTER TABLE "codeLanguage" RENAME CONSTRAINT "code_language_pkey" TO "codeLanguage_pkey";
ALTER TABLE "userProfile" RENAME CONSTRAINT "user_profile_pkey" TO "userProfile_pkey";

-- RenameIndex
ALTER INDEX "learning_style_name_key" RENAME TO "learningStyle_name_key";
ALTER INDEX "code_language_code_key" RENAME TO "codeLanguage_code_key";
ALTER INDEX "user_profile_learning_style_id_idx" RENAME TO "userProfile_learningStyleId_idx";
ALTER INDEX "user_profile_code_language_id_idx" RENAME TO "userProfile_codeLanguageId_idx";

-- RenameForeignKey
ALTER TABLE "userProfile" RENAME CONSTRAINT "user_profile_userId_fkey" TO "userProfile_userId_fkey";
ALTER TABLE "userProfile" RENAME CONSTRAINT "user_profile_learning_style_id_fkey" TO "userProfile_learningStyleId_fkey";
ALTER TABLE "userProfile" RENAME CONSTRAINT "user_profile_code_language_id_fkey" TO "userProfile_codeLanguageId_fkey";

-- AlterTable
ALTER TABLE "userProfile" ADD COLUMN "onboardingComplete" BOOLEAN NOT NULL DEFAULT false;

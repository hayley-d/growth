-- CreateEnum
CREATE TYPE "colour_theme" AS ENUM ('default', 'high-contrast', 'okabe-ito');

-- CreateTable
CREATE TABLE "code_language" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "code_language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_style" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "learning_style_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "learning_style_id" UUID NOT NULL,
    "code_language_id" UUID NOT NULL,
    "text_to_speech" BOOLEAN NOT NULL DEFAULT false,
    "colour_theme" "colour_theme" NOT NULL DEFAULT 'default',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "display_name" TEXT NOT NULL,
    "show_on_leaderboard" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "code_language_code_key" ON "code_language"("code");

-- CreateIndex
CREATE UNIQUE INDEX "learning_style_name_key" ON "learning_style"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_learning_style_id_idx" ON "user"("learning_style_id");

-- CreateIndex
CREATE INDEX "user_code_language_id_idx" ON "user"("code_language_id");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_learning_style_id_fkey" FOREIGN KEY ("learning_style_id") REFERENCES "learning_style"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_code_language_id_fkey" FOREIGN KEY ("code_language_id") REFERENCES "code_language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


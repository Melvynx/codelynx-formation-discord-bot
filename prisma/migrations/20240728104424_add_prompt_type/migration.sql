-- CreateEnum
CREATE TYPE "PromptType" AS ENUM ('SUBJECT', 'CLEAN', 'SEARCH');

-- AlterTable
ALTER TABLE "XPrompt" ADD COLUMN     "type" "PromptType" NOT NULL DEFAULT 'SUBJECT';

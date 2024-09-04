/*
  Warnings:

  - You are about to drop the column `Result` on the `XPrompt` table. All the data in the column will be lost.
  - You are about to drop the column `Send` on the `XPrompt` table. All the data in the column will be lost.
  - Added the required column `result` to the `XPrompt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `send` to the `XPrompt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "XPrompt" DROP COLUMN "Result",
DROP COLUMN "Send",
ADD COLUMN     "result" TEXT NOT NULL,
ADD COLUMN     "send" TEXT NOT NULL;

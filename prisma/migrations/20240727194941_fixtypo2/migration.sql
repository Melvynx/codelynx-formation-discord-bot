/*
  Warnings:

  - You are about to drop the column `reciveTokenUsed` on the `XPrompt` table. All the data in the column will be lost.
  - Added the required column `receiveTokenUsed` to the `XPrompt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "XPrompt" DROP COLUMN "reciveTokenUsed",
ADD COLUMN     "receiveTokenUsed" INTEGER NOT NULL;

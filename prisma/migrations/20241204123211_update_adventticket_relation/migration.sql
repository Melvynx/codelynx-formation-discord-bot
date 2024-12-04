/*
  Warnings:

  - Added the required column `adventUserId` to the `AdventTicket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AdventTicket" DROP CONSTRAINT "AdventTicket_id_fkey";

-- AlterTable
ALTER TABLE "AdventTicket" ADD COLUMN     "adventUserId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "AdventTicket" ADD CONSTRAINT "AdventTicket_adventUserId_fkey" FOREIGN KEY ("adventUserId") REFERENCES "AdventUser"("discordId") ON DELETE CASCADE ON UPDATE CASCADE;

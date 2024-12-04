/*
  Warnings:

  - You are about to drop the `AdventWinner` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "AdventWinner";

-- CreateTable
CREATE TABLE "AdventTicket" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdventTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdventUser" (
    "id" TEXT NOT NULL,
    "discordId" TEXT NOT NULL,
    "messageCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AdventUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdventUser_discordId_key" ON "AdventUser"("discordId");

-- AddForeignKey
ALTER TABLE "AdventTicket" ADD CONSTRAINT "AdventTicket_id_fkey" FOREIGN KEY ("id") REFERENCES "AdventUser"("discordId") ON DELETE CASCADE ON UPDATE CASCADE;

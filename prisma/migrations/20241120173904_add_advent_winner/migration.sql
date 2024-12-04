-- AlterTable
ALTER TABLE "AdventMessage" ALTER COLUMN "scheduleTime" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "AdventWinner" (
    "id" TEXT NOT NULL,
    "discordId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdventWinner_pkey" PRIMARY KEY ("id")
);

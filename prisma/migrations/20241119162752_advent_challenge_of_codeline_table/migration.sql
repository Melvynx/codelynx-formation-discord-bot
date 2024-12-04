-- CreateTable
CREATE TABLE "AdventMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "scheduleTime" TIMESTAMP(3) NOT NULL,
    "sendTime" TIMESTAMP(3),

    CONSTRAINT "AdventMessage_pkey" PRIMARY KEY ("id")
);

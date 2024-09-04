-- CreateEnum
CREATE TYPE "XPostType" AS ENUM ('POST', 'REPLY', 'SELF_REPLY', 'REPOST', 'CITATION');

-- CreateTable
CREATE TABLE "XPost" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL,
    "fullJson" TEXT NOT NULL,
    "threadId" TEXT,
    "type" "XPostType" NOT NULL,
    "previousPostId" TEXT,

    CONSTRAINT "XPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "XThread" (
    "id" TEXT NOT NULL,
    "fullContent" TEXT NOT NULL,

    CONSTRAINT "XThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "XSubject" (
    "id" TEXT NOT NULL,
    "threadId" TEXT,
    "postId" TEXT NOT NULL,
    "tags" TEXT[],
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,

    CONSTRAINT "XSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "XPrompt" (
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "Send" TEXT NOT NULL,
    "Result" TEXT NOT NULL,
    "sendTokenUsed" INTEGER NOT NULL,
    "reciveTokenUsed" INTEGER NOT NULL,
    "subjectId" TEXT,

    CONSTRAINT "XPrompt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "XPost" ADD CONSTRAINT "XPost_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "XThread"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XPost" ADD CONSTRAINT "XPost_previousPostId_fkey" FOREIGN KEY ("previousPostId") REFERENCES "XPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XSubject" ADD CONSTRAINT "XSubject_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "XThread"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XSubject" ADD CONSTRAINT "XSubject_postId_fkey" FOREIGN KEY ("postId") REFERENCES "XPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XPrompt" ADD CONSTRAINT "XPrompt_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "XSubject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

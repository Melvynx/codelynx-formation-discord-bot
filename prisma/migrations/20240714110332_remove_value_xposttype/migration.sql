/*
  Warnings:

  - The values [SELF_REPLY,REPOST,CITATION] on the enum `XPostType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "XPostType_new" AS ENUM ('POST', 'REPLY');
ALTER TABLE "XPost" ALTER COLUMN "type" TYPE "XPostType_new" USING ("type"::text::"XPostType_new");
ALTER TYPE "XPostType" RENAME TO "XPostType_old";
ALTER TYPE "XPostType_new" RENAME TO "XPostType";
DROP TYPE "XPostType_old";
COMMIT;

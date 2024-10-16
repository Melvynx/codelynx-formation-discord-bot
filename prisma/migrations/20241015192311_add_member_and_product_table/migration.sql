-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "discordUserId" TEXT,
    "email" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bundle" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Bundle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "premium" BOOLEAN NOT NULL,
    "discordRoleId" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MemberToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_BundleToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_BundleToMember" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_discordUserId_key" ON "Member"("discordUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Member_email_key" ON "Member"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_MemberToProduct_AB_unique" ON "_MemberToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_MemberToProduct_B_index" ON "_MemberToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BundleToProduct_AB_unique" ON "_BundleToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_BundleToProduct_B_index" ON "_BundleToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BundleToMember_AB_unique" ON "_BundleToMember"("A", "B");

-- CreateIndex
CREATE INDEX "_BundleToMember_B_index" ON "_BundleToMember"("B");

-- AddForeignKey
ALTER TABLE "_MemberToProduct" ADD CONSTRAINT "_MemberToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MemberToProduct" ADD CONSTRAINT "_MemberToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BundleToProduct" ADD CONSTRAINT "_BundleToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Bundle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BundleToProduct" ADD CONSTRAINT "_BundleToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BundleToMember" ADD CONSTRAINT "_BundleToMember_A_fkey" FOREIGN KEY ("A") REFERENCES "Bundle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BundleToMember" ADD CONSTRAINT "_BundleToMember_B_fkey" FOREIGN KEY ("B") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

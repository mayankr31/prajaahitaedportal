/*
  Warnings:

  - Added the required column `createdById` to the `programmes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "programmes" ADD COLUMN     "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "approvedById" TEXT,
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "rejectionMessage" TEXT;

-- AddForeignKey
ALTER TABLE "programmes" ADD CONSTRAINT "programmes_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programmes" ADD CONSTRAINT "programmes_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

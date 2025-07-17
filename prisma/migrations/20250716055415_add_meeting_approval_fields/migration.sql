/*
  Warnings:

  - Added the required column `createdById` to the `meetings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "meetings" ADD COLUMN     "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "approvedById" TEXT,
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "rejectionMessage" TEXT;

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

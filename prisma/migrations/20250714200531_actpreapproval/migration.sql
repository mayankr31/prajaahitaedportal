/*
  Warnings:

  - Added the required column `createdById` to the `activities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `prerequisites` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "activities" ADD COLUMN     "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "approvedById" TEXT,
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "rejectionMessage" TEXT;

-- AlterTable
ALTER TABLE "prerequisites" ADD COLUMN     "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "approvedById" TEXT,
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "rejectionMessage" TEXT;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prerequisites" ADD CONSTRAINT "prerequisites_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prerequisites" ADD CONSTRAINT "prerequisites_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

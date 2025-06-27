/*
  Warnings:

  - You are about to drop the column `date` on the `meetings` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `meetings` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `meetings` table. All the data in the column will be lost.
  - Added the required column `endDateTime` to the `meetings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDateTime` to the `meetings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "meetings" DROP COLUMN "date",
DROP COLUMN "duration",
DROP COLUMN "startTime",
ADD COLUMN     "endDateTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDateTime" TIMESTAMP(3) NOT NULL;

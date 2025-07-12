/*
  Warnings:

  - Added the required column `pdfUrl` to the `activities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "activities" ADD COLUMN     "category" TEXT,
ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "pdfUrl" TEXT NOT NULL,
ADD COLUMN     "time" TEXT;

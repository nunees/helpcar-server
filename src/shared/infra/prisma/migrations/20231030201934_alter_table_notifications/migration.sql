/*
  Warnings:

  - Added the required column `channel` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "channel" TEXT NOT NULL;

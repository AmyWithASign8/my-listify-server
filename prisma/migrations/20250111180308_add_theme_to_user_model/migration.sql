/*
  Warnings:

  - Added the required column `avatar` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('dark', 'light');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" BYTEA NOT NULL,
ADD COLUMN     "theme" "Theme" NOT NULL DEFAULT 'light';

/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `PendingUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token` to the `PendingUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PendingUser" ADD COLUMN     "token" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PendingUser_token_key" ON "PendingUser"("token");

/*
  Warnings:

  - You are about to drop the column `name` on the `Trigger` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[Zapid]` on the table `Trigger` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[zaprunid]` on the table `Zapoutbox` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Trigger" DROP COLUMN "name";

-- CreateIndex
CREATE UNIQUE INDEX "Trigger_Zapid_key" ON "Trigger"("Zapid");

-- CreateIndex
CREATE UNIQUE INDEX "Zapoutbox_zaprunid_key" ON "Zapoutbox"("zaprunid");

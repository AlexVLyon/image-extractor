/*
  Warnings:

  - You are about to drop the column `imageReaderType` on the `TextRecord` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TextRecord" DROP COLUMN "imageReaderType",
ADD COLUMN     "readerType" TEXT;

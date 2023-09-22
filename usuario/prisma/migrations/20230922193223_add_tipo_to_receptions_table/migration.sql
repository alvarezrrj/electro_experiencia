/*
  Warnings:

  - Added the required column `tipo` to the `recepciones` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `recepciones` ADD COLUMN `tipo` VARCHAR(191) NOT NULL;

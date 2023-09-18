/*
  Warnings:

  - You are about to alter the column `telefono` on the `recepciones` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(15)`.

*/
-- AlterTable
ALTER TABLE `recepciones` MODIFY `telefono` VARCHAR(15) NOT NULL;

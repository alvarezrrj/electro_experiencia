/*
  Warnings:

  - You are about to drop the column `rolId` on the `Usuario` table. All the data in the column will be lost.
  - Added the required column `rol` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Usuario` DROP FOREIGN KEY `Usuario_rolId_fkey`;

-- AlterTable
ALTER TABLE `Usuario` RENAME COLUMN `rolId`
    TO `rol`;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_rol_fkey` FOREIGN KEY (`rol`) REFERENCES `Rol`(`id_rol`) ON DELETE RESTRICT ON UPDATE CASCADE;

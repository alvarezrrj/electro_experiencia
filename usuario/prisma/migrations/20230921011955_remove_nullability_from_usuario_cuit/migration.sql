/*
  Warnings:

  - Made the column `cuit` on table `usuarios` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `usuarios` MODIFY `cuit` VARCHAR(32) NOT NULL;

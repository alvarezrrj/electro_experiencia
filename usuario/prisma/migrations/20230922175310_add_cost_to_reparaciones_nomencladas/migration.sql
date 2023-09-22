/*
  Warnings:

  - Added the required column `costo` to the `reparaciones_nomencladas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reparaciones_nomencladas` ADD COLUMN `costo` INTEGER NOT NULL;

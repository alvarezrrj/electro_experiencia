/*
  Warnings:

  - You are about to alter the column `cuit` on the `usuarios` table. The data in that column could be lost. The data in that column will be cast from `VarChar(32)` to `Int`.

*/

-- AlterTable
ALTER TABLE `usuarios` MODIFY `cuit` INTEGER NOT NULL;

/*
  Warnings:

  - You are about to alter the column `telefono` on the `usuarios` table. The data in that column could be lost. The data in that column will be cast from `VarChar(15)` to `Int`.

*/
-- AlterTable
ALTER TABLE `usuarios` MODIFY `telefono` INTEGER NOT NULL;

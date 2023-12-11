/*
  Warnings:

  - A unique constraint covering the columns `[cuit]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `usuarios` MODIFY `cuit` BIGINT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `usuarios_cuit_key` ON `usuarios`(`cuit`);

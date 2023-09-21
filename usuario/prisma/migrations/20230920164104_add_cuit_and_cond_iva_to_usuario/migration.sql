/*
  Warnings:

  - A unique constraint covering the columns `[cuit]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `condicion_iva` VARCHAR(191) NOT NULL DEFAULT 'Consumidor final',
    ADD COLUMN `cuit` VARCHAR(32) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `usuarios_cuit_key` ON `usuarios`(`cuit`);

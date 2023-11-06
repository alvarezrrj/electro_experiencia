/*
  Warnings:

  - You are about to drop the `Presupuesto` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Presupuesto` DROP FOREIGN KEY `Presupuesto_client_id_fkey`;

-- DropForeignKey
ALTER TABLE `Presupuesto` DROP FOREIGN KEY `Presupuesto_recepcion_id_fkey`;

-- AlterTable
ALTER TABLE `materiales` ADD COLUMN `presupuestoId` INTEGER NULL;

-- AlterTable
ALTER TABLE `reparaciones_nomencladas` ADD COLUMN `presupuestoId` INTEGER NULL;

-- DropTable
DROP TABLE `Presupuesto`;

-- CreateTable
CREATE TABLE `presupuestos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(191) NOT NULL,
    `recepcion_id` INTEGER NOT NULL,
    `client_id` INTEGER NULL,
    `estado` VARCHAR(191) NOT NULL,
    `confirmado` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `materiales` ADD CONSTRAINT `materiales_presupuestoId_fkey` FOREIGN KEY (`presupuestoId`) REFERENCES `presupuestos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `presupuestos` ADD CONSTRAINT `presupuestos_recepcion_id_fkey` FOREIGN KEY (`recepcion_id`) REFERENCES `recepciones`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `presupuestos` ADD CONSTRAINT `presupuestos_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reparaciones_nomencladas` ADD CONSTRAINT `reparaciones_nomencladas_presupuestoId_fkey` FOREIGN KEY (`presupuestoId`) REFERENCES `presupuestos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

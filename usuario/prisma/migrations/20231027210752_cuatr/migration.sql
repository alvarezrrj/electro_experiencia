/*
  Warnings:

  - You are about to drop the `Materiales_Usados` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `presupuestos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Materiales_Usados` DROP FOREIGN KEY `Materiales_Usados_material_id_fkey`;

-- DropForeignKey
ALTER TABLE `Materiales_Usados` DROP FOREIGN KEY `Materiales_Usados_reparacion_id_fkey`;

-- DropForeignKey
ALTER TABLE `presupuestos` DROP FOREIGN KEY `presupuestos_client_id_fkey`;

-- DropForeignKey
ALTER TABLE `presupuestos` DROP FOREIGN KEY `presupuestos_recepcion_id_fkey`;

-- DropTable
DROP TABLE `Materiales_Usados`;

-- DropTable
DROP TABLE `presupuestos`;

-- CreateTable
CREATE TABLE `Presupuesto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(191) NOT NULL,
    `recepcion_id` INTEGER NOT NULL,
    `client_id` INTEGER NOT NULL,
    `estado` VARCHAR(191) NOT NULL,
    `confirmado` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Presupuesto` ADD CONSTRAINT `Presupuesto_recepcion_id_fkey` FOREIGN KEY (`recepcion_id`) REFERENCES `recepciones`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Presupuesto` ADD CONSTRAINT `Presupuesto_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

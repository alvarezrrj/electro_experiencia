-- DropForeignKey
ALTER TABLE `materiales` DROP FOREIGN KEY `materiales_presupuestoId_fkey`;

-- DropForeignKey
ALTER TABLE `reparaciones_nomencladas` DROP FOREIGN KEY `reparaciones_nomencladas_presupuestoId_fkey`;

-- CreateTable
CREATE TABLE `_MaterialToPresupuesto` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_MaterialToPresupuesto_AB_unique`(`A`, `B`),
    INDEX `_MaterialToPresupuesto_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PresupuestoToReparacionNomenclada` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PresupuestoToReparacionNomenclada_AB_unique`(`A`, `B`),
    INDEX `_PresupuestoToReparacionNomenclada_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_MaterialToPresupuesto` ADD CONSTRAINT `_MaterialToPresupuesto_A_fkey` FOREIGN KEY (`A`) REFERENCES `materiales`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MaterialToPresupuesto` ADD CONSTRAINT `_MaterialToPresupuesto_B_fkey` FOREIGN KEY (`B`) REFERENCES `presupuestos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PresupuestoToReparacionNomenclada` ADD CONSTRAINT `_PresupuestoToReparacionNomenclada_A_fkey` FOREIGN KEY (`A`) REFERENCES `presupuestos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PresupuestoToReparacionNomenclada` ADD CONSTRAINT `_PresupuestoToReparacionNomenclada_B_fkey` FOREIGN KEY (`B`) REFERENCES `reparaciones_nomencladas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

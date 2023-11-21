-- DropIndex
DROP INDEX `materiales_presupuestoId_fkey` ON `materiales`;

-- DropIndex
DROP INDEX `reparaciones_nomencladas_presupuestoId_fkey` ON `reparaciones_nomencladas`;

-- CreateTable
CREATE TABLE `turnos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `descripcion` TEXT NOT NULL,
    `equipo` VARCHAR(191) NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `turnos_fecha_key`(`fecha`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reparacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `descripcion` TEXT NOT NULL,

    UNIQUE INDEX `Reparacion_name_key`(`name`),
    FULLTEXT INDEX `Reparacion_name_idx`(`name`),
    FULLTEXT INDEX `Reparacion_descripcion_idx`(`descripcion`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

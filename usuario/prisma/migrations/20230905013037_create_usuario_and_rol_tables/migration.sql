-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `last_name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(64) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `history` BIGINT UNSIGNED NOT NULL,
    `rol` INTEGER NOT NULL,

    UNIQUE INDEX `Usuario_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rol` (
    `id_rol` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Rol_descripcion_key`(`descripcion`),
    PRIMARY KEY (`id_rol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_rol_fkey` FOREIGN KEY (`rol`) REFERENCES `Rol`(`id_rol`) ON DELETE RESTRICT ON UPDATE CASCADE;

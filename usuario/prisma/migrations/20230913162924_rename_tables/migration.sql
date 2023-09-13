-- DropForeignKey
ALTER TABLE `usuarios` DROP FOREIGN KEY `Usuario_rol_fkey`;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_rol_fkey` FOREIGN KEY (`rol`) REFERENCES `roles`(`id_rol`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RedefineIndex
CREATE FULLTEXT INDEX `reparaciones_nomencladas_name_descripcion_idx` ON `reparaciones_nomencladas`(`name`, `descripcion`);
DROP INDEX `Reparacion_name_descripcion_idx` ON `reparaciones_nomencladas`;

-- RedefineIndex
CREATE UNIQUE INDEX `reparaciones_nomencladas_name_key` ON `reparaciones_nomencladas`(`name`);
DROP INDEX `Reparacion_name_key` ON `reparaciones_nomencladas`;

-- RedefineIndex
CREATE UNIQUE INDEX `roles_descripcion_key` ON `roles`(`descripcion`);
DROP INDEX `Rol_descripcion_key` ON `roles`;

-- RedefineIndex
CREATE UNIQUE INDEX `usuarios_email_key` ON `usuarios`(`email`);
DROP INDEX `Usuario_email_key` ON `usuarios`;

-- RedefineIndex
CREATE UNIQUE INDEX `usuarios_username_key` ON `usuarios`(`username`);
DROP INDEX `Usuario_username_key` ON `usuarios`;

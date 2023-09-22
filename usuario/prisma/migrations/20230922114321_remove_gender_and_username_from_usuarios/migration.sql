/*
  Warnings:

  - You are about to drop the column `gender` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `usuarios` table. All the data in the column will be lost.
  - Added the required column `telefono` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `usuarios_username_key` ON `usuarios`;

-- AlterTable
ALTER TABLE `usuarios` DROP COLUMN `gender`,
    DROP COLUMN `username`,
    ADD COLUMN `telefono` VARCHAR(15) NOT NULL;

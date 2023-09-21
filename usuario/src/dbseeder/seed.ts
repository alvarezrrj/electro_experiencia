import { PrismaClient } from "@prisma/client";
import { SD } from "../interfaces/interfaces";
import { createHash } from "node:crypto";

export const prisma = new PrismaClient();

/**
 * Crea los roles 'admin', 'client' y 'employee' si no existen y 
 * crea un administrador:
 *  username: admin
 *  email: admin@admin.com
 *  password: admin
 */
async function seed() {
    let adminRol = await prisma.rol.findUnique({
        where: {
            descripcion: SD.ROLES.ADMIN
        }
    });
    
    if (!adminRol) {
        // Delete all roles
        await prisma.rol.deleteMany({});
        adminRol = await prisma.rol.create({
            data: {
                descripcion: SD.ROLES.ADMIN
            }
        });
        await prisma.rol.createMany({
            data: [
                { descripcion: SD.ROLES.CLIENT },
                { descripcion: SD.ROLES.EMPLOYEE },
            ]
        });
    }

    let adminExists = await prisma.usuario.findFirst({
        where: {
            Rol: {
                descripcion: SD.ROLES.ADMIN
            }
        }
    });

    if (!adminExists) {
        // Hash password
        let hash = createHash("sha256");
        hash.update('admin');
        let password = hash.digest("hex");

        // Create admin
        await prisma.usuario.create({
            data: {
                id: 1,
                first_name: 'admin',
                last_name: 'admin',
                username: 'admin',
                email: 'admin@admin.com',
                password,
                gender: 'admin',
                cuit: 'admin',
                condicion_iva: 'admin',
                rol: adminRol.id_rol
            }
        });
    }
}

seed().then(() => console.log('Allisgood 👍'));
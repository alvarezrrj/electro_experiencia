import { PrismaClient } from "@prisma/client";
import { SD } from "../interfaces/interfaces";

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
        await prisma.usuario.create({
            data: {
                id: 1,
                first_name: 'admin',
                last_name: 'admin',
                username: 'admin',
                email: 'admin@admin.com',
                password: 'admin',
                gender: 'admin',
                rol: adminRol.id_rol
            }
        });
    }
}

seed().then(() => console.log('Allisgood 👍'));
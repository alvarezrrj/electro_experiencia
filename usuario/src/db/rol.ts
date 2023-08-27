import { prisma } from "..";

/**
 * Create new role
 * @param descripcion String
 * @returns created rol
 */
export async function createRol(descripcion: string) {
    return await prisma.rol.create({
        data: {
            descripcion: descripcion.trim().toLowerCase()
        }
    });
}

/**
 * Find rol by description
 */
export async function findRol(descripcion: string) {
    return await prisma.rol.findFirst({
        where: {
            descripcion
        }
    });
}
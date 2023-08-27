import { Usuario } from "@prisma/client";
import { prisma } from "..";

export async function createUser(user: Usuario) {
    return await prisma.usuario.create({
        data: user
    });
}

export async function findUser(dni: number) {
    return await prisma.usuario.findFirst({
        where: {
            dni
        }
    });
}

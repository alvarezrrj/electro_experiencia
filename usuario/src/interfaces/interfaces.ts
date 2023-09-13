import { ReparacionNomenclada, Usuario } from "@prisma/client";
import { Request } from "express";

export interface RoleRequest extends Request {
    roles?: {
        usuarios: Usuario[];
        id_rol: number;
        descripcion: string;
    }[]
}
export interface UserRequest extends Request {
    users?: Usuario[];
}
export interface RepairRequest extends Request {
    repairs?: ReparacionNomenclada[];
}

export class CustomError extends Error {}
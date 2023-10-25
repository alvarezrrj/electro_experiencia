import { Recepcion, ReparacionNomenclada, Usuario } from "@prisma/client";
import { Request } from "express";
import { usedMaterials } from "../controllers/usedMaterials";

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
export interface ReceptionRequest extends Request {
    receptions?: Recepcion[];
}

export interface usedMaterialsRequest extends Request {
    usedMaterials?: usedMaterials[];
}





export class CustomError extends Error {}

/**
 * Static Details
 */
export class SD {
    static readonly ROLES: {[key: string]: string} = {
        /**
         * IT department
         */
        ADMIN: 'admin',
        CLIENT: 'cliente',
        /**
         * Technician
         */
        EMPLOYEE: 'empleado',
    }
}
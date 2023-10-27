import { Recepcion, ReparacionNomenclada, Usuario, Materiales_Usados,Materials, presupuestos } from "@prisma/client";
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
export interface ReceptionRequest extends Request {
    receptions?: Recepcion[];
}

export interface usedMaterialsRequest extends Request {
    usedMaterials?: Materiales_Usados[];
}


export interface MaterialsRequest extends Request {
    Materials?: Materials[];
}

export interface presupuestosRequest extends Request {
    Presupuestos?: presupuestos[];
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
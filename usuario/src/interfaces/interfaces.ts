import {
  Recepcion,
  ReparacionNomenclada,
  Usuario,
  Material,
  Presupuesto,
  Proveedor,
  Turno,
} from "@prisma/client";
import { Request } from "express";

export interface RoleRequest extends Request {
  roles?: {
    usuarios: Usuario[];
    id_rol: number;
    descripcion: string;
  }[];
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

export interface MaterialsRequest extends Request {
  Materials?: Material[];
}

export interface presupuestosRequest extends Request {
  Presupuestos?: Presupuesto[];
}


export interface proveedorRequest extends Request {
  Proveedores?: Proveedor[];
}

export interface AppointmentRequest extends Request {
  appointments?: Turno[];
}

export class CustomError extends Error {}

/**
 * Static Details
 */
export class SD {
  static readonly ROLES: { [key: string]: string } = {
    /**
     * IT department
     */
    ADMIN: "admin",
    CLIENT: "cliente",
    /**
     * Technician
     */
    EMPLOYEE: "empleado",
  };
}

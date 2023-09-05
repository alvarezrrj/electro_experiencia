import { Prisma, Rol, Usuario } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { Request } from "express";

export interface RoleRequest extends Request {
    // roles?: Rol[];
    roles?: {
        usuarios: Usuario[];
        id_rol: number;
        descripcion: string;
    }[]
}
export interface UserRequest extends Request {
    users?: Usuario[];
}
export class CustomError extends Error {}

export const UserFields = [
  "id",
  "first_name",
  "last_name",
  "email",
  "password",
  "gender",
  "username",
  "history",
  "rol",
];
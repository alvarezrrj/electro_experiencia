import { Handler } from "express";
import { CustomError } from "../interfaces/interfaces";
import { findRol } from "../db/rol";

export const requiresDescription: Handler = (req, res, next) => {
    let descripcion = req.body.descripcion;
    if (! descripcion) {
        let err = new CustomError('Descripcion es requerida');
        err.name = '400';
        return next(err);
    }
    next();
}
export const failIfRoleExists: Handler = async (req, res, next) => {
    let role = await findRol(req.body.descripcion);
    if (role) {
        let err = new CustomError('Rol ya existe');
        err.name = '409';
        return next(err);
    }
    next();
}
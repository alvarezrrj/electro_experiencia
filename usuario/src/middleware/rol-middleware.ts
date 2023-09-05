import { Handler } from "express";
import { CustomError } from "../interfaces/interfaces";
import { Rol } from "../controllers/rol";

export const requiresDescription: Handler = (req, res, next) => {
    let descripcion = req.body.descripcion;
    if (! descripcion) {
        let err = new CustomError('Descripcion es requerida');
        err.name = '400';
        return next(err);
    }
    next();
}

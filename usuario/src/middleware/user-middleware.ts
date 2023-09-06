import { Handler } from "express";
import { CustomError } from "../interfaces/interfaces";
import { Usuario } from "@prisma/client";
import * as EmailValidator from 'email-validator';
import { Rol } from "../controllers/rol";

// /**
// * Ensure all required fields are present for adding/editing users
// */
// export const requiresUserFields: Handler = (req, res, next) => {
//     let data = req.body;
//     if (!data) {
//         let err = new CustomError('Data del usuario debe ir en el cuerpo del request');
//         err.name = '400';
//         return next(err);
//     }
//     for (let field of UserFields) {
//         if (!(field in data)) {
//             let err = new CustomError('Falta el campo ' + field);
//             err.name = '400';
//             return next(err);
//         }
//     }
//     next();
// };

export const validateUserFields: Handler = async (req, res, next) => {
    let data: Usuario = req.body;
    // validate email
    let emailValidated = EmailValidator.validate(data.email);
    if (!emailValidated) {
        let err = new CustomError('Email inválido');
        err.name = '400';
        return next(err);
    }
    // validate password
    if (data.password.length < 8 ||
        ! /[A-Z]/.test(data.password) ||
        ! /[a-z]/.test(data.password) ||
        ! /[0-9]/.test(data.password) ||
        ! /[^\w\b]/.test(data.password)) {
        let err = new CustomError('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un simbolo');
        err.name = '400';
        return next(err);
    }
    try {
        if (!data.rol) {
            let defaultRol = await Rol.findByDescripcion('client');
            if (!defaultRol) {
                let err = new CustomError('No pudimos encontrar un rol para asignarle a ese usuario');
                err.name = '404';
                return next(err);
            }
            data.rol = defaultRol.id_rol;
        }
        next();
    } catch (e) {
        next(e);
    }
};